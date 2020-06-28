import { GameMap } from '../map/map';
import { GameState, RunRound } from './state';
import { Token, Boost } from './enum';
import { CombatScenario, InitialStateFromScenario } from './scenario';
import { Player } from '../combatants/player';
import Combatant from '../combatants/combatant';

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

const cRoundLimit = 10;

// Given number of each type of enemy, number of players, assumed focus percentage, and who goes first
// Return number of total actions and number of threat actions
export function SimulateCombat(scenario : CombatScenario) : CombatStats
{
  let cRound = 0;
  let arePlayersDefeated = false;
  let isPrimaryDefeated = false;
  let state = InitialStateFromScenario(scenario);
  while(!isPrimaryDefeated && !arePlayersDefeated && cRound < cRoundLimit)
  {
    cRound++;
    state = RunRound(state);
    arePlayersDefeated = state.ArePlayersDefeated();
    isPrimaryDefeated = state.AreEnemiesDefeated();
  }

  return getCombatStats(!arePlayersDefeated && isPrimaryDefeated, state, cRound);
}

function getCombatStats(didPlayersWin : boolean, state : GameState, cRound : number) : CombatStats
{
  let totalPlayerHealth = 0;
  let totalPlayerFocus = 0;
  let unspentAdv = 0;
  let unspentDisadv = 0;
  let unspentDef = 0;
  let unspentExp = 0;
  let lowestPlayerHealth = 15;
  let lowestPlayerFocus = 12;
  let actionsTotal = 0;
  let actionsEnemy = 0;
  state.combatantsPC.forEach((player : Player) => {
    lowestPlayerHealth = Math.min(lowestPlayerHealth, player.health);
    lowestPlayerFocus = Math.min(lowestPlayerFocus, player.focus);
    totalPlayerHealth += player.health;
    totalPlayerFocus += player.focus;
    unspentAdv += player.tokens[Token.Action][Boost.Positive];
    unspentDisadv += player.tokens[Token.Action][Boost.Negative];
    unspentDef += player.tokens[Token.Defense][Boost.Positive];
    unspentExp += player.tokens[Token.Defense][Boost.Negative];
    actionsTotal += player.actionsTaken;
  });

  state.combatantsNPC.forEach((enemy : Combatant) => {
    unspentAdv += enemy.tokens[Token.Action][Boost.Positive];
    unspentDisadv += enemy.tokens[Token.Action][Boost.Negative];
    unspentDef += enemy.tokens[Token.Defense][Boost.Positive];
    unspentExp += enemy.tokens[Token.Defense][Boost.Negative];
    actionsTotal += enemy.actionsTaken;
    actionsEnemy += enemy.actionsTaken;
  });

  return {
    didPlayersWin : didPlayersWin,
    avgPlayerHealth : totalPlayerHealth / state.combatantsPC.length,
    avgPlayerFocus : totalPlayerFocus / state.combatantsPC.length,
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