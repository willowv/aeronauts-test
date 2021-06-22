import { AI } from "./ai";
import Combatant from "../combatant";
import { Token, Boost, Ability } from "../../../enum";
import { Action } from "../actions/action";
import { Attack, Defend } from "../actions/playerActions";
import { CombatState } from "../../state";

export class PlayerAI implements AI {
  primaryTarget: Combatant | null;

  constructor() {
    this.primaryTarget = null;
  }

  FindBestActionAndTarget(
    initialState: CombatState,
    self: Combatant
  ): { action: Action; target: Combatant } | null {
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
      if (roll < threshold) return { action: Defend, target: allyToDefend };
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
      return { action: Attack, target: enemiesCloseToDeath[0] };
    }

    if (this.primaryTarget === null || this.primaryTarget.isDead()) {
      let targets = Attack.GetValidTargets(initialState, self);
      let index = Math.round(Math.random() * (targets.length - 1));
      this.primaryTarget = targets[index];
    }

    return { action: Attack, target: this.primaryTarget };
  }
}
