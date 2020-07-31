import { AI } from "./ai";
import Combatant from "../combatant";
import { Token, Boost } from "../../../enum";

const minimum = (array: number[]) => Math.min(...array);
const sum = (array: number[]) => array.reduce((x, y) => x + y, 0);

export const PlayerAI = new AI("Player", (state) => {
  // player health and deaths - stay alive
  let alivePlayers = state.players.filter((player) => !player.isDead());
  let playerHealths = alivePlayers.map((player) => player.health);

  let playerHealthScore = 0;
  playerHealthScore += minimum(playerHealths); // encourage distributing damage

  // enemy health and kills - make progress
  let aliveEnemies = state.enemies.filter((enemy) => !enemy.isDead());
  let deadEnemies = state.enemies.filter((enemy) => enemy.isDead());
  let enemyHealthScore = 0;
  enemyHealthScore += sum(
    aliveEnemies.map((enemy) => enemy.maxHealth - enemy.health)
  );
  enemyHealthScore += sum(
    deadEnemies.map((enemy) => enemy.maxHealth + enemy.actionsPerTurn) // encourage kills
  );

  // Return true if some action has at least one valid target
  let canTargetAny = (player: Combatant) =>
    player.actions.some((action) => {
      let targets = action.GetValidTargets(state, player);
      return targets.length > 0;
    });

  let canTarget = (actor : Combatant, target : Combatant) =>
    actor.actions.some((action) => {
      let targets = action.GetValidTargets(state, actor);
      return targets.some((target2) => target2 === target);
    });

  let threatOn = (player : Combatant) => {
    return sum(aliveEnemies.map((enemy) => {
      return canTarget(enemy, player) ? enemy.actionsPerTurn : 0;
    }))
  }

  // Measures potential damage / harm from this position and token set up.
  let positioningScore = sum(
    alivePlayers.map((player) => {
      // 6 is based on two actions with expected value 3 (from external calculation)
      let offenseScore = canTargetAny(player) ? 6 + player.tokens[Token.Action][Boost.Positive] - player.tokens[Token.Action][Boost.Negative] : 0;
      // x2 is based on enemy actions having expected value 2 (from external calculation)
      let defenseScore = player.health - threatOn(player) * 2 + player.tokens[Token.Defense][Boost.Positive] - player.tokens[Token.Defense][Boost.Negative];
      return offenseScore + defenseScore;
    })
  );
  return playerHealthScore + enemyHealthScore + positioningScore;
});
