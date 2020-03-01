import Combatant from './combatants/combatant'
import { Enemy, EnemySet, rgEnemyFromEnemySet } from './combatants/enemy'
import { Player, PlayerSet, rgplayerFromPlayerSet } from './combatants/player'

const cRoundLimit = 10;

export interface CombatScenario {
  enemySetPrimary : EnemySet,
  enemySetSecondary : EnemySet,
  playerSet : PlayerSet,
  isAmbush : boolean,
  isAirCombat : boolean,
  startingFocus : number
}

// did players win; players average health/focus, lowest health/focus; unspent tokens of each type; total actions, enemy actions
export interface CombatStats {
  didPlayersWin : boolean;
  avgPlayerHealth : number;
  avgPlayerFocus : number;
  lowestPlayerHealth : number;
  lowestPlayerFocus : number;
  unspentAdv : number;
  unspentDisadv : number;
  unspentDef : number;
  unspentExp : number;
  actionsTotal : number;
  actionsEnemy : number;
  cRound: number;
}

// Given number of each type of enemy, number of players, assumed focus percentage, and who goes first
// Return number of total actions and number of threat actions
export function SimulateCombat(scenario : CombatScenario) : CombatStats
{
  let baseActions = scenario.isAirCombat ? 1 : 2;
  let actTotal = 0;
  let actEnemy = 0;
  let rgenemyPrimary = rgEnemyFromEnemySet(scenario.enemySetPrimary, baseActions);
  let rgenemySecondary = rgEnemyFromEnemySet(scenario.enemySetSecondary, baseActions);
  let rgplayer = rgplayerFromPlayerSet(scenario.playerSet, baseActions, scenario.startingFocus);
  if(scenario.isAirCombat)
  {
    // Add two extra players (captain and engineer can double as the health for the other two for now)
    // I guess we're assuming there's always a captain and an engineer
    rgplayer.push(new Player(0, [0,0,0,1,0], 6));
    rgplayer.push(new Player(0, [0,0,0,1,0], 6));
  }

  // Combat
  if(scenario.isAmbush)
  {
    // 1 enemy action per player (how to decide what these are?)
    actEnemy += rgplayer.length;
  }

  let isPrimaryDefeated = false;
  let arePlayersDefeated = false;
  let cRound = 0;
  while(!isPrimaryDefeated && !arePlayersDefeated && cRound < cRoundLimit)
  {
    cRound++;
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
  }

  return getCombatStats(!arePlayersDefeated && isPrimaryDefeated, rgplayer, rgenemyPrimary, rgenemySecondary, actTotal, actEnemy, cRound);
}

function getCombatStats(
  didPlayersWin : boolean,
  rgplayer : Player[],
  rgenemyPrimary : Enemy[],
  rgenemySecondary : Enemy[],
  actionsTotal : number,
  actionsEnemy : number,
  cRound : number) : CombatStats
{
  let totalPlayerHealth = 0;
  let totalPlayerFocus = 0;
  let unspentAdv = 0;
  let unspentDisadv = 0;
  let unspentDef = 0;
  let unspentExp = 0;
  let lowestPlayerHealth = 15;
  let lowestPlayerFocus = 12;
  rgplayer.forEach((player : Player) => {
    lowestPlayerHealth = Math.min(lowestPlayerHealth, player.health);
    lowestPlayerFocus = Math.min(lowestPlayerFocus, player.focus);
    totalPlayerHealth += player.health;
    totalPlayerFocus += player.focus;
    unspentAdv += player.adv;
    unspentDisadv += player.disadv;
    unspentDef += player.def;
    unspentExp += player.exp;
  });

  rgenemyPrimary.forEach((enemy : Enemy) => {
    unspentAdv += enemy.adv;
    unspentDisadv += enemy.disadv;
    unspentDef += enemy.def;
    unspentExp += enemy.exp;
  });

  rgenemySecondary.forEach((enemy : Enemy) => {
    unspentAdv += enemy.adv;
    unspentDisadv += enemy.disadv;
    unspentDef += enemy.def;
    unspentExp += enemy.exp;
  });

  return {
    didPlayersWin : didPlayersWin,
    avgPlayerHealth : totalPlayerHealth / rgplayer.length,
    avgPlayerFocus : totalPlayerFocus / rgplayer.length,
    lowestPlayerHealth : lowestPlayerHealth,
    lowestPlayerFocus : lowestPlayerFocus,
    unspentAdv : unspentAdv,
    unspentDisadv : unspentDisadv,
    unspentDef : unspentDef,
    unspentExp : unspentExp,
    actionsTotal : actionsTotal,
    actionsEnemy : actionsEnemy,
    cRound : cRound
  };
}