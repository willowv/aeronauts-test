import { AI } from "./ai";
import { CombatantType } from "../../../enum";

export const PlayerAI = new AI("Player", (state) => {
  // player health and deaths - stay alive
  let playerHealthScore = 0;
  let lowestPlayerHealth = 15;
  let alivePlayers = state.players.filter((player) => !player.isDead());
  alivePlayers.forEach((player) => {
    playerHealthScore += player.health; // 1 point for each point of health remaining
    if (player.health < lowestPlayerHealth) lowestPlayerHealth = player.health;
  });
  playerHealthScore += lowestPlayerHealth; // encourage distributing damage

  // enemy health and kills - make progress
  let enemyHealthScore = 0;
  state.enemies.forEach((enemy) => {
    switch (enemy.combatantType) {
      case CombatantType.Normal:
        enemyHealthScore += 4 - enemy.health;
        break;
      case CombatantType.Dangerous:
        enemyHealthScore += 8 - enemy.health;
        break;
      case CombatantType.Tough:
        enemyHealthScore += 12 - enemy.health;
        break;
      case CombatantType.Scary:
        enemyHealthScore += 16 - enemy.health;
        break;
    }
    if (enemy.isDead()) enemyHealthScore += enemy.actionsPerTurn; // encourage kills
  });

  // positioning - make sure you can target
  let positioningScore = 0;
  alivePlayers.forEach((player) => {
    let canTarget = false;
    player.actions.forEach((action) => {
      let targets = action.GetValidTargets(state, player);
      if (targets.length > 0) canTarget = true;
    });
    if (canTarget) positioningScore += 1;
  });
  return playerHealthScore + enemyHealthScore + positioningScore;
});
