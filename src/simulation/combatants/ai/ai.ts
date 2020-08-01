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
  FindBestMove(initialState: CombatState, combatant: Combatant): number | null {
    let potentialMoves: number[] = initialState.map.ZonesMovableFrom(
      combatant.zone
    );
    if (potentialMoves.length === 0) return null;
    return this.FindBestMoveAmong(initialState, combatant, potentialMoves);
  }

  FindBestMoveAmong(
    initialState: CombatState,
    combatant: Combatant,
    zones: number[],
    isForced: boolean = false
  ): number | null {
    let bestMove: number | null = null;
    let bestScore: number = this.score(initialState);
    zones.forEach((zoneDest) => {
      let expectedState = Move(
        initialState,
        combatant,
        zoneDest,
        ExpectedValueForBoostAndModifier,
        this,
        isForced
      );
      let expectedValue = this.score(expectedState);
      if (expectedValue > bestScore) {
        bestMove = zoneDest;
        bestScore = expectedValue;
      }
    });
    return bestMove;
  }

  FindBestAllyMove(
    initialState: CombatState,
    combatant: Combatant
  ): { ally: Combatant; zoneDest: number } | null {
    let allies = combatant.isPlayer()
      ? initialState.players
      : initialState.enemies;
    let bestAllyMove: { ally: Combatant; zoneDest: number } | null = null;
    let bestScore = 0;
    allies.forEach((ally) => {
      let movableZones = initialState.map.ZonesMovableFrom(ally.zone);
      movableZones.forEach((zoneDest) => {
        let expectedState = Move(
          initialState,
          combatant,
          zoneDest,
          ExpectedValueForBoostAndModifier,
          this
        );
        let expectedValue = this.score(expectedState);
        if (expectedValue > bestScore) {
          bestAllyMove = { ally, zoneDest };
          bestScore = expectedValue;
        }
      });
    });
    return bestAllyMove;
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
