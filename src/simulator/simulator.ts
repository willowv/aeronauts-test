import { GameState, RunRound } from './state';
import { Token, Boost } from '../enum';
import { CombatScenario, InitialStateFromScenario } from './scenario';
import { Player } from '../combatants/player';
import Combatant from '../combatants/combatant';

export interface Statistic {
  mean : number,
  sd: number
}

export interface ScenarioReport{
  playerWinRate : number,
  playerInjuryRate : number,
  avgRoundCount : Statistic,
  avgActionCount : Statistic,
  avgEnemyActionCount: Statistic
}

// did players win; players average health/focus, lowest health/focus; unspent tokens of each type; total actions, enemy actions
interface CombatStats {
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
export function SimulateScenario(scenario : CombatScenario, trials : number) : ScenarioReport
{
  let initialState = InitialStateFromScenario(scenario);
  let combatStats = [];
  for(let trial = 0; trial < trials; trial++) {
    combatStats.push(SimulateCombat(initialState));
  }
  return GetScenarioStats(combatStats);
}

function SimulateCombat(initialState : GameState) : CombatStats
{
  let cRound = 0;
  let arePlayersDefeated = false;
  let isPrimaryDefeated = false;
  let state = initialState.clone();
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

function GetScenarioStats(combatStats : CombatStats[]) : ScenarioReport {
  let cTrials = combatStats.length;
  let cPlayersWin = 0;
  let cPlayerInjury = 0;
  let totalRounds = 0;
  let totalEnemyActions = 0;
  let totalActions = 0;
  combatStats.forEach((stats) => {
    if(stats.didPlayersWin)
      cPlayersWin++;
    
    if(stats.lowestPlayerHealth <= 5)
      cPlayerInjury++;
    
    totalRounds += stats.cRound;
    totalEnemyActions += stats.actionsEnemy;
    totalActions += stats.actionsTotal;
  });

  let avgRoundCountMean = totalRounds / cTrials;
  let avgActionCountMean = totalActions / cTrials;
  let avgEnemyActionCountMean = totalEnemyActions / cTrials;
  let avgRoundCountVarianceSquared = 0;
  let avgActionCountVarianceSquared = 0;
  let avgEnemyActionCountVarianceSquared = 0;
  combatStats.forEach((stats) => {
    // take each number, subtract the mean, square the result
    // sum these differences
    avgRoundCountVarianceSquared += Math.pow(stats.cRound - avgRoundCountMean, 2);
    avgActionCountVarianceSquared += Math.pow(stats.actionsTotal - avgActionCountMean, 2);
    avgEnemyActionCountVarianceSquared += Math.pow(stats.actionsEnemy - avgEnemyActionCountMean, 2);
  })

  return {
    playerWinRate : cPlayersWin / cTrials,
    playerInjuryRate : cPlayerInjury / cTrials,
    avgRoundCount : { mean: avgRoundCountMean, sd: Math.sqrt(avgRoundCountVarianceSquared / cTrials) },
    avgActionCount : { mean: avgActionCountMean, sd: Math.sqrt(avgActionCountVarianceSquared / cTrials) },
    avgEnemyActionCount: { mean: avgEnemyActionCountMean, sd: Math.sqrt(avgEnemyActionCountVarianceSquared / cTrials) },
  }
}