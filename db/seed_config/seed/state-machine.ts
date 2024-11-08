import type {
  SeederState,
  SeederEvent,
  Transition,
  ValidationResult,
  StateTransitionMap,
  isBuildingState,
  isInsertingState,
  isReturningState,
  isLoggingState,
  isFailingState,
  isCompletedState,
} from '@db/seed_config/types/seed-types'
import { logWithContext } from '@utils/logger'
import type { LogInfo } from '@utils/logger'
import { Effect } from 'effect'

export class SeederStateMachine<T> {
  private stateTransitions: StateTransitionMap<T>

  constructor(
    private currentState: SeederState<T>,
    private readonly validateData: (data: T[]) => ValidationResult,
    private readonly component: string,
  ) {
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
        FAILED: (state, event) => this.toFailed(state, event, 'building'),
      },
    }
  }

  private toBuilding(state: SeederState<T>, event: SeederEvent): SeederState<T> {
    if (!isBuildingState(state)) {
      return {
        status: 'buildingData',
        timestamps: {
          stateStarted: new Date(),
          stateEnded: null,
        },
        dataSet: [],
        rowsBuilt: 0,
      }
    }
    return state
  }

  // Calculate new state based on current state + event
  private calculateNewState(event: SeederEvent): SeederState<T> {
    return this.stateTransitions[this.currentState.status][event.type](this.currentState, event) ?? this.currentState
  }

  // Get current state
  getState(): SeederState<T> {
    return this.currentState
  }

  // Transition to a new state
  transition(event: SeederEvent): Effect.Effect<SeederState<T>, Error> {
    const self = this
    return Effect.gen(function* () {
      // log transition start
      yield* logWithContext({
        component: self.component,
        message: `Transitioning from ${self.currentState.status} with event ${event.type}`,
        level: 'Info',
        context: { currentState: self.currentState, event },
      })

      // calculate new state based on current state + event
      const newState = self.calculateNewState(event)

      // validate if needed
      if (newState.status === 'buildingData') {
        const validation = self.validateData(newState.dataSet)
        if (!validation.isValid) {
          return yield* Effect.fail(new Error(validation.error))
        }
      }
      return yield* Effect.succeed(newState)
    })
  }
}
