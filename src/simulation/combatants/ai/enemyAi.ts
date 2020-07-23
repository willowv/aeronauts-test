import { AI } from "./ai";

export const EnemyAI = new AI("Enemy", (state) => {
  // score is good if player HP is low, best if player HPs are close to the same amount
  // score is good if a player can be attacked
  let playerHealthScore = 0;
  let highestPlayerHealth = 0;
  state.players.forEach((player) => {
    playerHealthScore += 15 - player.health; // 1 point for each point of damage dealt
    if (player.health > highestPlayerHealth)
      highestPlayerHealth = player.health;
  });
  playerHealthScore += 15 - highestPlayerHealth; // encourage distributing damage

  // positioning score
  let positioningScore = 0;
  let aliveEnemies = state.enemies.filter((enemy) => !enemy.isDead());
  aliveEnemies.forEach((enemy) => {
    let canTarget = false;
    enemy.actions.forEach((action) => {
      let targets = action.GetValidTargets(state, enemy);
      if (targets.length > 0) canTarget = true;
    });
    if (canTarget) positioningScore += enemy.actionsPerTurn; // 1 point for each enemy that has valid targets x their actions per turn
  });
  return playerHealthScore + positioningScore;
});
