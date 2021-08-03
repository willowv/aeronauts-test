import { AI } from "./ai";
import Combatant from "../combatant";
import { Token, Boost, Ability } from "../../../enum";
import { Action } from "../actions/action";
import {
  AntiAir,
  Attack,
  AugmentSystems,
  Bombs,
  Cannons,
  Defend,
  FighterGuns,
  Torpedoes,
} from "../actions/playerActions";
import { CombatState } from "../../state";
import {
  Airship,
  AllQuadrants,
  Quadrant,
  WeaponType,
} from "../../airships/airship";
import { NoAction } from "../actions/npcActions";

export class PlayerAI implements AI {
  FindBestActionAndTarget(
    initialState: CombatState,
    self: Combatant
  ): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    // Filter allies for: doesn't have defense tokens, less than 10 health
    let alliesNeedingDefense = initialState.players
      .filter(
        (ally) =>
          ally !== self &&
          ally.tokens[Token.Defense][Boost.Positive] === 0 &&
          ally.health < 10 &&
          !ally.isDead()
      )
      .sort((allyA, allyB) => allyA.health - allyB.health);

    if (alliesNeedingDefense.length !== 0) {
      let allyToDefend = alliesNeedingDefense[0];
      let playerSelf = initialState.GetCombatantAsPlayer(self);
      let points = 0;
      // Figure number of points - 1 for each tier down, 1 for each point of perception
      if (allyToDefend.health < 10) points++;
      if (allyToDefend.health <= 5) points++;
      points += playerSelf?.abilityScores[Ability.Perception] ?? 0;

      // Roll to determine whether to defend this ally or attack
      let threshold = 0.125 * points;
      let roll = Math.random();
      if (roll < threshold)
        return {
          action: Defend,
          source: self,
          target: allyToDefend,
        };
    }

    let enemiesCloseToDeath = (
      Attack.GetValidTargets(initialState) as Combatant[]
    )
      .filter(
        (enemy) =>
          !enemy.isDead() && enemy.effectiveHealth() <= self.partialDamage
      )
      .sort(
        (enemyA, enemyB) => enemyA.effectiveHealth() - enemyB.effectiveHealth()
      );

    if (enemiesCloseToDeath.length !== 0) {
      return {
        action: Attack,
        source: self,
        target: enemiesCloseToDeath[0],
      };
    }

    let primaryTarget = null;
    if (self.indexTarget !== null) {
      primaryTarget = initialState.enemies[self.indexTarget];
    }
    if (primaryTarget === null || primaryTarget.isDead()) {
      let targets = Attack.GetValidTargets(initialState);
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
        action: Attack,
        source: self,
        target: initialState.enemies[self.indexTarget],
      };

    return {
      action: NoAction,
      source: self,
      target: self,
    };
  }
}

export class PlayerInterceptorAI implements AI {
  FindBestActionAndTarget(
    state: CombatState,
    self: Combatant
  ): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    // If there's an enemy close to death, go after them first
    let enemiesCloseToDeath = (
      FighterGuns.GetValidTargets(state) as Combatant[]
    )
      .filter(
        (enemy) =>
          !enemy.isDead() && enemy.effectiveHealth() <= self.partialDamage
      )
      .sort(
        (enemyA, enemyB) => enemyA.effectiveHealth() - enemyB.effectiveHealth()
      );

    if (enemiesCloseToDeath.length !== 0) {
      return {
        action: FighterGuns,
        source: self,
        target: enemiesCloseToDeath[0],
      };
    }

    let primaryTarget = null;
    if (self.indexTarget !== null)
      primaryTarget = state.enemies[self.indexTarget];

    if (primaryTarget === null || primaryTarget.isDead()) {
      let targets = FighterGuns.GetValidTargets(state);
      if (targets.length === 0) {
        self.indexTarget = null;
        primaryTarget = null;
      } else {
        let index = Math.round(Math.random() * (targets.length - 1));
        self.indexTarget = (targets[index] as Combatant).index;
      }
    }

    // We just made sure this target is valid
    if (self.indexTarget !== null) {
      return {
        action: FighterGuns,
        source: self,
        target: state.enemies[self.indexTarget],
      };
    }

    // If we made it here, there was no valid fighter target
    let enemyAirship = state.enemyAirship;
    if (enemyAirship !== null && !enemyAirship.isDead()) {
      let target = enemyAirship.bestTargetQuadrant(WeaponType.Bomb);
      if (target !== null)
        return {
          action: Bombs,
          source: self,
          target: target,
        };
    }

    // If there were no valid targets, then return No Action
    return {
      action: NoAction,
      source: self,
      target: self,
    };
  }
}

export class PlayerBomberAI implements AI {
  FindBestActionAndTarget(
    state: CombatState,
    self: Combatant
  ): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    // If it's possible to bomb, do bombing
    let enemyAirship = state.enemyAirship;
    if (enemyAirship !== null && !enemyAirship.isDead()) {
      let target = enemyAirship.bestTargetQuadrant(WeaponType.Bomb);
      if (target !== null)
        return {
          action: Bombs,
          source: self,
          target: target,
        };
    }

    // Otherwise use fighter targeting
    let enemiesCloseToDeath = (
      FighterGuns.GetValidTargets(state) as Combatant[]
    )
      .filter(
        (enemy) =>
          !enemy.isDead() && enemy.effectiveHealth() <= self.partialDamage
      )
      .sort(
        (enemyA, enemyB) => enemyA.effectiveHealth() - enemyB.effectiveHealth()
      );

    if (enemiesCloseToDeath.length !== 0) {
      return {
        action: FighterGuns,
        source: self,
        target: enemiesCloseToDeath[0],
      };
    }

    let primaryTarget = null;
    if (self.indexTarget !== null)
      primaryTarget = state.enemies[self.indexTarget];

    if (primaryTarget === null || primaryTarget.isDead()) {
      let targets = FighterGuns.GetValidTargets(state);
      if (targets.length === 0) {
        self.indexTarget = null;
        primaryTarget = null;
      } else {
        let index = Math.round(Math.random() * (targets.length - 1));
        self.indexTarget = (targets[index] as Combatant).index;
      }
    }

    // We just made sure this target is valid
    if (self.indexTarget !== null) {
      return {
        action: FighterGuns,
        source: self,
        target: state.enemies[self.indexTarget],
      };
    }

    // If there were no valid targets, then return No Action
    return {
      action: NoAction,
      source: self,
      target: self,
    };
  }
}

export class PlayerCaptainAI implements AI {
  FindBestActionAndTarget(
    state: CombatState,
    self: Combatant
  ): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    // What is best target quadrant? What is best attacking quadrant?
    // Get best attacking quadrant, then choose best target for it

    // If there's no airship or the airship is dead, we cannot act
    if (state.playerAirship === null || state.playerAirship.isDead())
      return {
        action: NoAction,
        source: self,
        target: self,
      };

    // If there's no enemy airship or the airship is dead, target an enemy fighter
    if (state.enemyAirship === null || state.enemyAirship.isDead()) {
      let enemiesCloseToDeath = (AntiAir.GetValidTargets(state) as Combatant[])
        .filter(
          (enemy) =>
            !enemy.isDead() && enemy.effectiveHealth() <= self.partialDamage
        )
        .sort(
          (enemyA, enemyB) =>
            enemyA.effectiveHealth() - enemyB.effectiveHealth()
        );

      if (enemiesCloseToDeath.length !== 0) {
        return {
          action: AntiAir,
          source: self,
          target: enemiesCloseToDeath[0],
        };
      }

      let primaryTarget = null;
      if (self.indexTarget !== null)
        primaryTarget = state.enemies[self.indexTarget];

      if (primaryTarget === null || primaryTarget.isDead()) {
        let targets = AntiAir.GetValidTargets(state);
        if (targets.length === 0) {
          self.indexTarget = null;
          primaryTarget = null;
        } else {
          let index = Math.round(Math.random() * (targets.length - 1));
          self.indexTarget = (targets[index] as Combatant).index;
        }
      }

      if (self.indexTarget !== null) {
        return {
          action: AntiAir,
          source: state.playerAirship.bestQuadrantOfSetForOffense(
            AllQuadrants()
          ),
          target: state.enemies[self.indexTarget],
        };
      }
    }

    if (state.enemyAirship !== null && !state.enemyAirship.isDead()) {
      let attackQuadrant = state.playerAirship.bestAttackingQuadrant(
        state.enemyAirship
      );
      if (attackQuadrant === null)
        return {
          action: NoAction,
          source: self,
          target: self,
        };

      let weaponType =
        attackQuadrant === Quadrant.A ? WeaponType.Cannon : WeaponType.Torpedo;
      return {
        action: weaponType === WeaponType.Cannon ? Cannons : Torpedoes,
        source: attackQuadrant,
        target: state.playerAirship.bestTargetQuadrantForAttackFrom(
          attackQuadrant,
          state.enemyAirship
        ),
      };
    }

    // If there were no valid targets, then return No Action
    return {
      action: NoAction,
      source: self,
      target: self,
    };
  }
}

export class PlayerEngineerAI implements AI {
  FindBestActionAndTarget(
    state: CombatState,
    self: Combatant
  ): {
    action: Action;
    source: Quadrant | Combatant;
    target: Quadrant | Combatant;
  } {
    // If there's no airship or the airship is dead, we cannot act
    if (state.playerAirship === null || state.playerAirship.isDead())
      return {
        action: NoAction,
        source: self,
        target: self,
      };

    let bestOffenseQuadrant = state.playerAirship.bestQuadrantOfSetForOffense(
      AllQuadrants()
    );
    let worstDefenseQuadrant = state.playerAirship.worstQuadrantOfSetForDefense(
      AllQuadrants()
    );
    let isShipFast = state.playerAirship.speedTokens[Boost.Positive] > 0;
    let isShipSafe =
      worstDefenseQuadrant !== null &&
      state.playerAirship.getAdjustedHealthOfQuadrant(worstDefenseQuadrant) >=
        8;
    let isShipBuffed =
      bestOffenseQuadrant !== null &&
      state.playerAirship.advantageTokensByQuadrant[bestOffenseQuadrant] > 0;
    if (isShipFast && isShipSafe && isShipBuffed) {
      let deputized = new PlayerCaptainAI();
      return deputized.FindBestActionAndTarget(state, self);
    }
    return {
      action: AugmentSystems,
      source: self,
      target: self, // not really, but this action doesn't care anyway
    };
  }
}
