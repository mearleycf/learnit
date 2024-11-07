import type { SeederState, SeederEvent, Transition, ValidationResult } from '@db/seed_config/types/seed-types'
import { logWithContext } from '@utils/logger'
import type { LogInfo } from '@utils/logger'
import { Effect } from 'effect'

export class SeederStateMachine<T> {
  constructor(
    private currentState: SeederState<T>,
    private readonly validateData: (data: T[]) => ValidationResult,
    private readonly component: string,
  ) {}

  // Get current state
  getState(): SeederState<T> {
    return this.currentState
  }

  // Handle transitions
  transition(event: SeederEvent): Effect.Effect<SeederState<T>, Error> {
    return Effect.gen(function* () {
      // Transition logic here
    })
  }
}
