import { AI } from "./ai";
import Combatant from "../combatant";
import { Action } from "../actions/action";
import { CombatState } from "../../state";
import { Quadrant, WeaponType } from "../../airships/airship";
import { NoAction } from "../actions/npcActions";

export class EnemyAI implements AI {
  FindBestActionAndTarget(
    initialState: CombatState,
    self: Combatant
  ): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    // My primary target is whoever attacked me last, or choose randomly
    let action = self.actions[0]; // enemies only have 1 attack at the moment

    let primaryTarget = null;
    if (self.indexTarget !== null) {
      primaryTarget = initialState.players[self.indexTarget];
    }
    if (primaryTarget === null || primaryTarget.isDead()) {
      let targets = action.GetValidTargets(initialState);
      if (targets.length === 0)
        return {
          action: NoAction,
          source: self,
          target: self,
        };

      let index = Math.round(Math.random() * (targets.length - 1));
      self.indexTarget = (targets[index] as Combatant).index;
    }

    return {
      action: action,
      source: self,
      target: initialState.players[self.indexTarget ?? 0],
    };
  }
}

export class EnemyFighterAI implements AI {
  FindBestActionAndTarget(
    initialState: CombatState,
    self: Combatant
  ): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    // Am I bombing, or attacking a fighter?
    // Bomb only if it's as efficient as possible - take minimal damage (enemy has disadvantage tokens)
    // and maximize damage dealt (lowest adjusted health quadrant)
    let playerAirship = initialState.playerAirship;
    if (playerAirship !== null && !playerAirship.isDead()) {
      let candidateTarget = playerAirship.bestTargetQuadrant(WeaponType.Bomb);
      if (
        candidateTarget !== null &&
        playerAirship.disadvantageTokensByQuadrant[candidateTarget] >= 1
      )
        return {
          action: self.actions[1],
          source: self,
          target: candidateTarget,
        };
    }

    // My primary target is whoever attacked me last, or choose randomly
    let action = self.actions[0]; // enemies only have 1 attack at the moment

    let primaryTarget = null;
    if (self.indexTarget !== null) {
      primaryTarget = initialState.players[self.indexTarget];
    }
    if (primaryTarget === null || primaryTarget.isDead()) {
      let targets = action.GetValidTargets(initialState);
      if (targets.length === 0)
        return {
          action: NoAction,
          source: self,
          target: self,
        };

      let index = Math.round(Math.random() * (targets.length - 1));
      self.indexTarget = (targets[index] as Combatant).index;
    }

    return {
      action: action,
      source: self,
      target: initialState.players[self.indexTarget ?? 0],
    };
  }
}
