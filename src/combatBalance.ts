import Combatant from './combatant'
import { Enemy, EnemySet, rgEnemyFromEnemySet } from './enemy'
import { Player, PlayerSet, rgplayerFromPlayerSet } from './player'

const playerActions = 2;
const cRoundLimit = 10;

// Given number of each type of enemy, number of players, assumed focus percentage, and who goes first
// Return number of total actions and number of threat actions
export function SimulateCombat(
  enemySetPrimary : EnemySet,
  enemySetSecondary : EnemySet, 
  playerSet : PlayerSet, 
  fPlayersFirst : boolean,
  startingFocus : number)
{
  let actTotal = 0;
  let actEnemy = 0;
  let rgenemyPrimary = rgEnemyFromEnemySet(enemySetPrimary);
  let rgenemySecondary = rgEnemyFromEnemySet(enemySetSecondary);
  let rgplayer = rgplayerFromPlayerSet(playerSet, playerActions, startingFocus);
  
  // Combat
  if(!fPlayersFirst)
  {
    // 1 enemy action per player (how to decide what these are?)
    actEnemy += rgplayer.length;
  }

  let isPrimaryDefeated = false;
  let arePlayersDefeated = false;
  let cRound = 0;
  while(!isPrimaryDefeated && !arePlayersDefeated && cRound < cRoundLimit)
  {
    arePlayersDefeated = true;
    rgplayer.forEach((player : Player) => {
      if(!player.isDead()) {
        arePlayersDefeated = false;
        actTotal += player.act(rgplayer, rgenemyPrimary, rgenemySecondary);
      }
    });
    if(arePlayersDefeated) break;

    isPrimaryDefeated = true;
    rgenemyPrimary.forEach((enemy : Enemy) => {
      if(!enemy.isDead()) {
        isPrimaryDefeated = false;
        let actions = enemy.act(rgplayer, rgenemyPrimary, rgenemySecondary);
        actEnemy += actions;
        actTotal += actions;
      }
    });
    if(isPrimaryDefeated) break;

    rgenemySecondary.forEach((enemy : Enemy) => {
      if(!enemy.isDead()) {
        let actions = enemy.act(rgplayer, rgenemyPrimary, rgenemySecondary);
        actEnemy += actions;
        actTotal += actions;
      }
    });
    cRound++;
  }
  
  return [actTotal, actEnemy];
}