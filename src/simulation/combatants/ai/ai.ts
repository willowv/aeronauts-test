import { CombatState } from "../../state";
import { GetModifierBoostAndStateForPlayerRoll } from "../../simulator";
import { ProbRollGreaterOrEqualToTarget } from "../../dice";
import Combatant from "../combatant";
import { Action } from "../actions/action";

export class AI {
  name: string;
  score: (state: CombatState) => number;

  constructor(name: string, score: (state: CombatState) => number) {
    this.name = name;
    this.score = score;
  }

  // Returns the state where the best move has been made, or null if no move should be made
  FindBestMove(
    initialState: CombatState,
    initialCombatant: Combatant
  ): CombatState | null {
    let state = initialState.clone();
    let combatant = state.GetCombatant(initialCombatant);
    let potentialMoves: number[] = initialState.map.ZonesMovableFrom(
      combatant.zone
    );
    if (potentialMoves.length === 0) return null;

    let moveStates: CombatState[] = potentialMoves.map((zoneDest) => {
      let newState = state.clone();
      let newCombatant = newState.GetCombatant(combatant);
      newCombatant.zone = zoneDest;
      newCombatant.actionsTaken++;
      return newState;
    });
    moveStates.sort(
      (stateA, stateB) => this.score(stateB) - this.score(stateA)
    );
    let initialScore = this.score(initialState);
    if (this.score(moveStates[0]) > initialScore) return moveStates[0];
    else return null;
  }

  FindBestActionAndTarget(
    initialState: CombatState,
    initialCombatant: Combatant
  ): { action: Action; target: Combatant } | null {
    // Try each of combatant's actions on each possible target
    // Try an action by scoring it on each of its outcomes, and calculating expected value
    // For the action with the highest expected value, evaluate it normally, and return that state
    let bestActionAndTarget: {
      action: Action;
      target: Combatant;
    } | null = null;
    let bestScore: number = 0;
    let state = initialState.clone();
    let combatant = state.GetCombatant(initialCombatant);
    combatant.actions.forEach((action) => {
      let targets = action.GetValidTargets(initialState, combatant);
      targets.forEach((target) => {
        let expectedValue = this.GetExpectedValueOfAction(
          initialState,
          combatant,
          target,
          action
        );
        if (expectedValue > bestScore) {
          bestActionAndTarget = { action, target };
          bestScore = expectedValue;
        }
      });
    });
    return bestActionAndTarget;
  }

  GetExpectedValueOfAction(
    initialState: CombatState,
    combatant: Combatant,
    target: Combatant,
    action: Action
  ): number {
    let { boost, modifier, state } = GetModifierBoostAndStateForPlayerRoll(
      initialState,
      combatant,
      target,
      action.ability,
      action.type
    );
    let successState = action.evaluate(
      action.highThreshold,
      combatant,
      target,
      state
    );
    let successProbability = ProbRollGreaterOrEqualToTarget(
      modifier,
      boost,
      action.highThreshold
    );
    let successScore = this.score(successState);

    let partialSuccessState = action.evaluate(
      action.lowThreshold,
      combatant,
      target,
      state
    );
    let partialSuccessProbability =
      ProbRollGreaterOrEqualToTarget(modifier, boost, action.lowThreshold) -
      successProbability;
    let partialSuccessScore = this.score(partialSuccessState);

    let failureState = action.evaluate(
      action.lowThreshold - 1,
      combatant,
      target,
      state
    );
    let failureProbability =
      1 - (successProbability + partialSuccessProbability);
    let failureScore = this.score(failureState);

    return (
      successScore * successProbability +
      partialSuccessScore * partialSuccessProbability +
      failureScore * failureProbability
    );
  }
}
