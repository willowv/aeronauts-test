import { Enemy, EnemySet, rgEnemyFromEnemySet } from './combatants/enemy'
import { Player, PlayerSet, rgplayerFromPlayerSet } from './combatants/player'
import { Token, Boost } from './combatants/combatant';

const cRoundLimit = 10;

export interface CombatScenario {
  enemySetPrimary : EnemySet,
  enemySetSecondary : EnemySet,
  playerSet : PlayerSet,
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
  let rgplayer = rgplayerFromPlayerSet(scenario.playerSet, baseActions, scenario.startingFocus);
  let rgenemy =
    rgEnemyFromEnemySet(scenario.enemySetPrimary, baseActions, true /* primary enemies are critical */).concat(
    rgEnemyFromEnemySet(scenario.enemySetSecondary, baseActions, false /* secondary enemies are not */));

  let isPrimaryDefeated = false;
  let arePlayersDefeated = false;
  let cRound = 0;
  while(!isPrimaryDefeated && !arePlayersDefeated && cRound < cRoundLimit)
  {
    cRound++;
    arePlayersDefeated = true;
    rgplayer.forEach((player : Player) => {
      if(!player.isDead()) {
        if(player.isCritical())
          arePlayersDefeated = false;
        
        actTotal += player.act(rgplayer, rgenemy);
      }
    });
    if(arePlayersDefeated) break;

    isPrimaryDefeated = true;
    rgenemy.forEach((enemy : Enemy) => {
      if(!enemy.isDead()) {
        if(enemy.isCritical())
          isPrimaryDefeated = false;
        
        let actions = enemy.act(rgplayer, rgenemy);
        actEnemy += actions;
        actTotal += actions;
      }
    });
    if(isPrimaryDefeated) break;
  }

  return getCombatStats(!arePlayersDefeated && isPrimaryDefeated, rgplayer, rgenemy, actTotal, actEnemy, cRound);
}

function getCombatStats(
  didPlayersWin : boolean,
  rgplayer : Player[],
  rgenemy : Enemy[],
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
    lowestPlayerHealth = Math.min(lowestPlayerHealth, player.getHealth());
    lowestPlayerFocus = Math.min(lowestPlayerFocus, player.focus);
    totalPlayerHealth += player.getHealth();
    totalPlayerFocus += player.focus;
    unspentAdv += player.tokens[Token.Action][Boost.Positive];
    unspentDisadv += player.tokens[Token.Action][Boost.Negative];
    unspentDef += player.tokens[Token.Defense][Boost.Positive];
    unspentExp += player.tokens[Token.Defense][Boost.Negative];
  });

  rgenemy.forEach((enemy : Enemy) => {
    unspentAdv += enemy.tokens[Token.Action][Boost.Positive];
    unspentDisadv += enemy.tokens[Token.Action][Boost.Negative];
    unspentDef += enemy.tokens[Token.Defense][Boost.Positive];
    unspentExp += enemy.tokens[Token.Defense][Boost.Negative];
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