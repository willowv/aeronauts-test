import { CombatState } from "../../state";
import { Act } from "../../simulator";
import { ExpectedValueForBoostAndModifier } from "../../dice";
import Combatant from "../combatant";
import { Action } from "../actions/action";

export class AI {
  name: string;
  score: (state: CombatState) => number;

  constructor(name: string, score: (state: CombatState) => number) {
    this.name = name;
    this.score = score;
  }

  FindBestActionAndTarget(
    initialState: CombatState,
    combatant: Combatant
  ): { action: Action; target: Combatant } | null {
    // Try each of combatant's actions on each possible target
    // Try an action by scoring it on each of its outcomes, and calculating expected value
    // For the action with the highest expected value, evaluate it normally, and return that state
    let bestActionAndTarget: {
      action: Action;
      target: Combatant;
    } | null = null;
    let bestScore: number = 0;
    combatant.actions.forEach((action) => {
      let targets = action.GetValidTargets(initialState, combatant);
      targets.forEach((target) => {
        let expectedState = Act(
          initialState,
          combatant,
          action,
          target,
          ExpectedValueForBoostAndModifier,
          this
        );
        let expectedValue = this.score(expectedState);
        if (expectedValue > bestScore) {
          bestActionAndTarget = { action, target };
          bestScore = expectedValue;
        }
      });
    });
    return bestActionAndTarget;
  }
}
