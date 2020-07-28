import { AI } from "./ai";
import Combatant from "../combatant";

const maximum = (array: number[]) => Math.max(...array);
const sum = (array: number[]) => array.reduce((x, y) => x + y, 0);

export const EnemyAI = new AI("Enemy", (state) => {
  // score is good if player HP is low, best if player HPs are close to the same amount
  // score is good if a player can be attacked
  let playerHealths = state.players.map((player) => player.health);
  
  let playerHealthScore = 0
  playerHealthScore += (15 * state.players.length) - sum(playerHealths); // 1 point for each point of damage dealt
  playerHealthScore += 15 - maximum(playerHealths); // encourage distributing damage

  // Return true if some action has at least one valid target
  let canTarget = (enemy: Combatant) => enemy.actions.some((action) => {
    let targets = action.GetValidTargets(state, enemy);
    return targets.length > 0;
  });
  // positioning score
  let aliveEnemies = state.enemies.filter((enemy) => !enemy.isDead());
  let positioningScore = sum(
    aliveEnemies.map((enemy) => {
      // 1 point for each enemy that has valid targets x their actions per turn
      return canTarget(enemy) ? enemy.actionsPerTurn : 0;
    })
  );
  return playerHealthScore + positioningScore;
});
