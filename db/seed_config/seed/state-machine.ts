import {
  type SeederState,
  type SeederEvent,
  type Transition,
  type ValidationResult,
  type StateTransitionMap,
  type StateHistoryEntry,
  type TransitionFunction,
  isBuildingState,
  isInsertingState,
  isReturningState,
  isLoggingState,
  isFailingState,
  isCompletedState,
} from '@db/seed_config/types/seed-types'
import { SeedingError } from '../types/seed-error-types'
import { logWithContext } from '@utils/logger'
import type { LogInfo } from '@utils/logger'
import type { logInfo } from 'effect/Effect'
import { Effect } from 'effect'

export class SeederStateMachine<T> {
  private stateTransitions: StateTransitionMap<T>
  private stateHistory: StateHistoryEntry[] = []

  constructor(
    private currentState: SeederState<T>,
    private readonly validateData: (data: T[]) => ValidationResult,
    private readonly component: string,
  ) {
    // Add initial state to history
    this.stateHistory.push({
      status: currentState.status,
      stateStarted: new Date(),
      stateEnded: null,
    })

    // initialize transition map
    this.stateTransitions = {
      notStarted: {
        START_BUILD: (state, event) => this.toBuilding(state, event),
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: state => state,
      },
      buildingData: {
        START_BUILD: state => state,
        BUILD_COMPLETE: (state, event) => this.toBuilt(state, event),
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: state => state,
      },
      builtData: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: (state, event) => this.toInserting(state, event),
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: state => state,
      },
      insertingData: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: (state, event) => this.toInserted(state, event),
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: state => state,
      },
      insertedData: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: (state, event) => this.toReturning(state, event),
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: state => state,
      },
      returningData: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: (state, event) => this.toReturned(state, event),
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: state => state,
      },
      returnedData: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: (state, event) => this.toLogging(state, event),
        LOG_COMPLETE: state => state,
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: state => state,
      },
      loggingResult: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: (state, event) => this.toLogged(state, event),
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: state => state,
      },
      loggedResult: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: (state, event) => this.toSeederCompleted(state, event),
      },
      failing: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: (state, event) => this.toFailed(state, event),
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: state => state,
      },
      failed: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: state => state,
        FAIL_COMPLETE: (state, event) => this.toSeederCompleted(state, event),
        SEEDER_COMPLETE: state => state,
      },
      seederCompleted: {
        START_BUILD: state => state,
        BUILD_COMPLETE: state => state,
        START_INSERT: state => state,
        INSERT_COMPLETE: state => state,
        START_RETURN: state => state,
        RETURN_COMPLETE: state => state,
        START_LOG: state => state,
        LOG_COMPLETE: state => state,
        START_FAIL: state => state,
        FAIL_COMPLETE: state => state,
        SEEDER_COMPLETE: (state, event) => this.toSeederCompleted(state, event),
      },
    }
  }

  private toBuilding(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    if (!isBuildingState(state)) {
      return {
        status: 'buildingData',
        timestamps: state.timestamps,
        dataSet: [],
        rowsBuilt: 0,
      }
    }
    return state
  }

  private toBuilt(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    if (isBuildingState(state)) {
      return {
        status: 'builtData',
        timestamps: state.timestamps,
        dataSet: state.dataSet,
        rowsBuilt: state.rowsBuilt,
      }
    }
    return state
  }

  private toInserting(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    if (!isInsertingState(state)) {
      return {
        status: 'insertingData',
        timestamps: state.timestamps,
        dataSet: state.dataSet,
        rowsInserted: 0,
      }
    }
    return state
  }

  private toInserted(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    return state
  }

  private toReturning(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    return state
  }

  private toReturned(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    return state
  }

  private toLogging(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    return state
  }

  private toLogged(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    return state
  }

  private toSeederCompleted(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    return state
  }

  private toFailed(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    if (!isFailingState(state)) {
      return {
        status: 'failed',
        timestamps: state.timestamps,
        error:
          event.error ??
          new SeedingError(new Error(`unknown error occurred`), {
            table: 'courses', // stubbed in temporarily
            operation: 'insert', // stubbed in temporarily
          }),
        lastValidState: state,
        phase: event.phase,
      }
    }
    return state
  }

  private calculateNewState(event: SeederEvent): SeederState<T> {
    const status = this.currentState.status
    const transitionFn = this.stateTransitions[status][event.type] as TransitionFunction<T, typeof status>

    return (
      transitionFn(this.currentState as Extract<SeederState<T>, { status: typeof status }>, event) ?? this.currentState
    )
  }

  // Get current state
  getState(): SeederState<T> {
    return this.currentState
  }

  private updateStateHistory(oldState: SeederState<T>, newState: SeederState<T>) {
    // capture this
    const self = this

    // Close the previous state entry
    const currentEntry = this.stateHistory[this.stateHistory.length - 1]
    if (currentEntry && currentEntry.status === oldState.status) {
      currentEntry.stateEnded = new Date()
    }

    // Create new timestamp for the new state
    const now = new Date()

    // Update the actual state timestamps
    newState.timestamps = {
      stateStarted: now,
      stateEnded: null,
    }

    // Add new state entry to history
    this.stateHistory.push({
      status: newState.status,
      stateStarted: now,
      stateEnded: null,
    })

    // Log the transition
    return Effect.gen(function* () {
      yield* logWithContext({
        component: self.component,
        message: `State transition: ${oldState.status} -> ${newState.status}`,
        level: 'Info',
        context: {
          previousState: {
            status: oldState.status,
            started: currentEntry?.stateStarted,
            ended: currentEntry?.stateEnded,
          },
          newState: {
            status: newState.status,
            started: now,
          },
        },
      })
    })
  }

  // Add a method to get the history
  getStateHistory(): StateHistoryEntry[] {
    return this.stateHistory
  }

  // Transition to a new state
  transition(event: SeederEvent): Effect.Effect<SeederState<T>, Error> {
    const self = this
    return Effect.gen(function* () {
      const oldState = self.currentState

      // calculate new state based on current state + event
      const newState = self.calculateNewState(event)

      // validate if needed
      if (newState.status === 'buildingData' && newState.dataSet) {
        const validation = self.validateData(newState.dataSet)
        if (!validation.isValid) {
          return yield* Effect.fail(new Error(validation.error))
        }
      }

      // Update state history
      yield* self.updateStateHistory(oldState, newState)

      return yield* Effect.succeed(newState)
    })
  }

  // Add a method to format and print the history
  printStateHistory(): void {
    this.stateHistory.forEach(entry => {
      console.log(
        `${entry.status}: stateStarted: ${entry.stateStarted.toLocaleString('en-US', {
          timeZone: 'America/New_York',
          dateStyle: 'medium',
          timeStyle: 'long',
        })}`,
      )
      if (entry.stateEnded) {
        console.log(
          `${entry.status}: stateEnded: ${entry.stateEnded.toLocaleString('en-US', {
            timeZone: 'America/New_York',
            dateStyle: 'medium',
            timeStyle: 'long',
          })}`,
        )
      }
    })
  }
}
