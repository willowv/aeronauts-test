import { SimulateCombat, CombatScenario, CombatStats } from './combatBalance'

const cTrials = 10000;

interface Statistic {
  mean : number,
  sd: number
}

interface ScenarioReport{
  playerWinRate : number,
  playerInjuryRate : number,
  avgRoundCount : Statistic,
  avgActionCount : Statistic,
  avgEnemyActionCount: Statistic
}

test('4 Players, Similar Numbers, Medium Difficulty', () => {
  let scenario : CombatScenario = {
    enemySetPrimary : { cNormal: 0, cDangerous: 0, cTough: 2, cScary: 0 },
    enemySetSecondary : { cNormal: 0, cDangerous: 2, cTough: 0, cScary: 0 },
    playerSet : {
      rgpicac: [
        [2, 1, 1, 0, 0],
        [0, 2, 1, 1, 0],
        [0, 0, 2, 1, 1],
        [1, 0, 0, 2, 1],
      ]
    },
    isAmbush : false,
    startingFocus : 12
  }
  let rgstats : CombatStats[] = [];
  for(let i = 0; i < cTrials; i++)
    rgstats.push(SimulateCombat(scenario));

  let cPlayersWin = 0;
  let cPlayerInjury = 0;
  let totalRounds = 0;
  let totalEnemyActions = 0;
  let totalActions = 0;
  rgstats.forEach((stats) => {
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
  rgstats.forEach((stats) => {
    // take each number, subtract the mean, square the result
    // sum these differences
    avgRoundCountVarianceSquared += Math.pow(stats.cRound - avgRoundCountMean, 2);
    avgActionCountVarianceSquared += Math.pow(stats.actionsTotal - avgActionCountMean, 2);
    avgEnemyActionCountVarianceSquared += Math.pow(stats.actionsEnemy - avgEnemyActionCountMean, 2);
  })

  let report : ScenarioReport = {
    playerWinRate : cPlayersWin / cTrials,
    playerInjuryRate : cPlayerInjury / cTrials,
    avgRoundCount : { mean: avgRoundCountMean, sd: Math.sqrt(avgRoundCountVarianceSquared / cTrials) },
    avgActionCount : { mean: avgActionCountMean, sd: Math.sqrt(avgActionCountVarianceSquared / cTrials) },
    avgEnemyActionCount: { mean: avgEnemyActionCountMean, sd: Math.sqrt(avgEnemyActionCountVarianceSquared / cTrials) },
  }
  
  console.log(report);
});