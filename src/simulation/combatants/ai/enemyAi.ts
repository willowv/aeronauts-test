import { AI } from "./ai";
import Combatant from "../combatant";
import { Action } from "../actions/action";
import { CombatState } from "../../state";
import { Quadrant, WeaponType } from "../../airships/airship";
import {
  EnemyAttack,
  EnemyBombs,
  EnemyFighterGuns,
  NoAction,
} from "../actions/npcActions";

export class EnemyAI implements AI {
  FindBestActionAndTarget(
    initialState: CombatState,
    self: Combatant
  ): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    let primaryTarget = null;
    if (self.indexTarget !== null) {
      primaryTarget = initialState.players[self.indexTarget];
    }
    if (primaryTarget === null || primaryTarget.isDead()) {
      let targets = EnemyAttack.GetValidTargets(initialState);
      if (targets.length === 0) {
        primaryTarget = null;
        self.indexTarget = null;
      } else {
        let index = Math.round(Math.random() * (targets.length - 1));
        self.indexTarget = (targets[index] as Combatant).index;
      }
    }

    if (self.indexTarget !== null)
      return {
        action: EnemyAttack,
        source: self,
        target: initialState.players[self.indexTarget],
      };

    return {
      action: NoAction,
      source: self,
      target: self,
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
      if (candidateTarget !== null) {
        let isTargetOpen =
          playerAirship.suppressionByQuadrant[candidateTarget] ||
          playerAirship.disadvantageTokensByQuadrant[candidateTarget] > 0;
        let isTargetJuicy =
          playerAirship.getAdjustedHealthOfQuadrant(candidateTarget) <
          self.fullDamage;
        let isTargetUndefended =
          EnemyFighterGuns.GetValidTargets(initialState).length === 0;
        if ((isTargetOpen && isTargetJuicy) || isTargetUndefended)
          return {
            action: EnemyBombs,
            source: self,
            target: candidateTarget,
          };
      }
    }

    let primaryTarget = null;
    if (self.indexTarget !== null) {
      primaryTarget = initialState.players[self.indexTarget];
    }
    if (primaryTarget === null || primaryTarget.isDead()) {
      let targets = EnemyFighterGuns.GetValidTargets(initialState);
      if (targets.length === 0) {
        primaryTarget = null;
        self.indexTarget = null;
      } else {
        let index = Math.round(Math.random() * (targets.length - 1));
        self.indexTarget = (targets[index] as Combatant).index;
      }
    }

    if (self.indexTarget !== null)
      return {
        action: EnemyFighterGuns,
        source: self,
        target: initialState.players[self.indexTarget],
      };

    return {
      action: NoAction,
      source: self,
      target: self,
    };
  }
}
