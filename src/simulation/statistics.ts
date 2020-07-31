import { CombatState } from "./state";
import { Player } from "./combatants/player";
import { Token, Boost } from "../enum";
import Combatant from "./combatants/combatant";

export interface Statistic {
  mean: number;
  sd: number;
}

export class ScenarioReport {
  playerWinRate: number;
  playerInjuryRate: number;
  avgRoundCount: Statistic;
  avgActionCount: Statistic;
  avgEnemyActionCount: Statistic;

  constructor(
    playerWinRate: number,
    playerInjuryRate: number,
    avgRoundCount: Statistic,
    avgActionCount: Statistic,
    avgEnemyActionCount: Statistic
  ) {
    this.playerWinRate = playerWinRate;
    this.playerInjuryRate = playerInjuryRate;
    this.avgRoundCount = avgRoundCount;
    this.avgActionCount = avgActionCount;
    this.avgEnemyActionCount = avgEnemyActionCount;
  }
}

// did players win; players average health/focus, lowest health/focus; unspent tokens of each type; total actions, enemy actions
export interface CombatReport {
  didPlayersWin: boolean;
  avgPlayerHealth: number;
  avgPlayerFocus: number;
  lowestPlayerHealth: number;
  lowestPlayerFocus: number;
  unspentAdv: number;
  unspentDisadv: number;
  unspentDef: number;
  unspentExp: number;
  actionsTotal: number;
  actionsEnemy: number;
  cRound: number;
}

export function CombatReportFromFinalState(
  finalState: CombatState,
  numberOfRounds: number
): CombatReport {
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
  let didPlayersWin = finalState.AreEnemiesDefeated() && !finalState.ArePlayersDefeated()
  finalState.players.forEach((player: Player) => {
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

  finalState.enemies.forEach((enemy: Combatant) => {
    unspentAdv += enemy.tokens[Token.Action][Boost.Positive];
    unspentDisadv += enemy.tokens[Token.Action][Boost.Negative];
    unspentDef += enemy.tokens[Token.Defense][Boost.Positive];
    unspentExp += enemy.tokens[Token.Defense][Boost.Negative];
    actionsTotal += enemy.actionsTaken;
    actionsEnemy += enemy.actionsTaken;
  });

  return {
    didPlayersWin: didPlayersWin,
    avgPlayerHealth: totalPlayerHealth / finalState.players.length,
    avgPlayerFocus: totalPlayerFocus / finalState.players.length,
    lowestPlayerHealth: lowestPlayerHealth,
    lowestPlayerFocus: lowestPlayerFocus,
    unspentAdv: unspentAdv,
    unspentDisadv: unspentDisadv,
    unspentDef: unspentDef,
    unspentExp: unspentExp,
    actionsTotal: actionsTotal,
    actionsEnemy: actionsEnemy,
    cRound: numberOfRounds,
  };
}

export function ScenarioReportFromCombatReports(
  combatReports: CombatReport[]
): ScenarioReport {
  let numberOfTrials = combatReports.length;
  let numberOfPlayerWins = 0;
  let numberOfCombatsWithInjury = 0;
  let totalRounds = 0;
  let totalEnemyActions = 0;
  let totalActions = 0;
  combatReports.forEach((stats) => {
    if (stats.didPlayersWin) numberOfPlayerWins++;

    if (stats.lowestPlayerHealth <= 5) numberOfCombatsWithInjury++;

    totalRounds += stats.cRound;
    totalEnemyActions += stats.actionsEnemy;
    totalActions += stats.actionsTotal;
  });

  let avgRoundCountMean = totalRounds / numberOfTrials;
  let avgActionCountMean = totalActions / numberOfTrials;
  let avgEnemyActionCountMean = totalEnemyActions / numberOfTrials;
  let avgRoundCountVarianceSquared = 0;
  let avgActionCountVarianceSquared = 0;
  let avgEnemyActionCountVarianceSquared = 0;
  combatReports.forEach((stats) => {
    // take each number, subtract the mean, square the result
    // sum these differences
    avgRoundCountVarianceSquared += (stats.cRound - avgRoundCountMean) ** 2;
    avgActionCountVarianceSquared +=
      (stats.actionsTotal - avgActionCountMean) ** 2;
    avgEnemyActionCountVarianceSquared +=
      (stats.actionsEnemy - avgEnemyActionCountMean) ** 2;
  });

  return {
    playerWinRate: numberOfPlayerWins / numberOfTrials,
    playerInjuryRate: numberOfCombatsWithInjury / numberOfTrials,
    avgRoundCount: {
      mean: avgRoundCountMean,
      sd: Math.sqrt(avgRoundCountVarianceSquared / numberOfTrials),
    },
    avgActionCount: {
      mean: avgActionCountMean,
      sd: Math.sqrt(avgActionCountVarianceSquared / numberOfTrials),
    },
    avgEnemyActionCount: {
      mean: avgEnemyActionCountMean,
      sd: Math.sqrt(avgEnemyActionCountVarianceSquared / numberOfTrials),
    },
  };
}
