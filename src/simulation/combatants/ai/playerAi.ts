import { AI } from "./ai";
import Combatant from "../combatant";
import { Token, Boost, Ability } from "../../../enum";
import { Action } from "../actions/action";
import { Attack, Defend } from "../actions/playerActions";
import { CombatState } from "../../state";
import { Quadrant } from "../../airships/airship";
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

    let effectiveHealth: (enemy: Combatant) => number = (enemy) =>
      enemy.health -
      enemy.tokens[Token.Defense][Boost.Negative] +
      enemy.tokens[Token.Defense][Boost.Positive];

    let enemiesCloseToDeath = initialState.enemies
      .filter((enemy) => !enemy.isDead() && effectiveHealth(enemy) <= 3)
      .sort(
        (enemyA, enemyB) => effectiveHealth(enemyA) - effectiveHealth(enemyB)
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
      action: Attack,
      source: self,
      target: initialState.enemies[self.indexTarget ?? 0],
    };

    // TODO: air combat player AIs, and use them
  }
}

// Captain AI
// For attack, determine which quadrant to attack with - B and C will be torps, A will be cannons
// Attack with whatever has the greatest advantage vs. the enemy's weakest quadrant, then pick a weapon that can do that
// When to attack fighters? If there's no interceptor on our team, attack an enemy fighter 33% of the time, prioritize enemies with no disadvantage
