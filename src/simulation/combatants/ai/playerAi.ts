import { AI } from "./ai";
import Combatant from "../combatant";

const minimum = (array: number[]) => Math.min(...array);
const sum = (array: number[]) => array.reduce((x, y) => x + y, 0);

export const PlayerAI = new AI("Player", (state) => {
  // player health and deaths - stay alive
  let alivePlayers = state.players.filter((player) => !player.isDead());
  let playerHealths = alivePlayers.map((player) => player.health);

  let playerHealthScore = 0;
  playerHealthScore += sum(playerHealths); // 1 point for each point of health remaining
  playerHealthScore += minimum(playerHealths); // encourage distributing damage

  // enemy health and kills - make progress
  let enemyHealthScore = 0;
  enemyHealthScore += sum(
    state.enemies.map((enemy) => enemy.maxHealth - Math.max(enemy.health, 0))
  );
  enemyHealthScore += sum(
    state.enemies
      .filter((enemy) => enemy.isDead())
      .map((enemy) => enemy.actionsPerTurn) // encourage kills
  );

  // Return true if some action has at least one valid target
  let canTarget = (player: Combatant) =>
    player.actions.some((action) => {
      let targets = action.GetValidTargets(state, player);
      return targets.length > 0;
    });
  // positioning - make sure you can target
  let positioningScore = sum(
    alivePlayers.map((player) => {
      // 1 point for each player that has valid targets
      return canTarget(player) ? 1 : 0;
    })
  );
  return playerHealthScore + enemyHealthScore + positioningScore;
});
