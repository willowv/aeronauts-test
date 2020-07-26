import { CombatState } from "../../state";
import { Move, Act } from "../../simulator";
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

  // Returns the best zone destination, or null if the best move is not to move
  FindBestMove(
    initialState: CombatState,
    combatant: Combatant
  ): number | null {
    let bestMove: number | null = null;
    let bestScore: number = this.score(initialState);
    let potentialMoves: number[] = initialState.map.ZonesMovableFrom(
      combatant.zone
    );
    if (potentialMoves.length === 0) return null;
    
    potentialMoves.forEach((zoneDest) => {
      let expectedState = Move(initialState, combatant, zoneDest, ExpectedValueForBoostAndModifier);
      let expectedValue = this.score(expectedState);
      if(expectedValue > bestScore) {
        bestMove = zoneDest;
        bestScore = expectedValue;
      }
    });
    return bestMove;
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
        let expectedState = Act(initialState, combatant, action, target, ExpectedValueForBoostAndModifier);
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
