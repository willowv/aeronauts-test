import { SimulateCombat, CombatStats } from './simulator/simulator'
import { CombatScenario, EmptyPS, EmptyES, EnemySet, PlayerSet } from './simulator/scenario';
import { GameMap, Dijkstras } from './map/map';
import { TerrainDefault } from './map/terrain';

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

// test map is a 4 node branch and rejoin path
let testMapTerrain = [
  TerrainDefault,
  TerrainDefault,
  TerrainDefault,
  TerrainDefault
];

let testMapAdjacency = [
  [false, true, true, false], // start node is adjacent to 2 and 3
  [true, false, false, true], // mid nodes are adjacent to start and end, but not eachother
  [true, false, false, true],
  [false, true, true, false]]; // end node is adjacent to 2 and 3

let testMap = new GameMap(testMapTerrain, testMapAdjacency);

test('Dijkstras Algorithm implementation', () => {
  // Run dijkstra's on each node
  let dijkstras0 = Dijkstras(testMapAdjacency, 0);
  expect(dijkstras0.distances).toEqual([0, 1, 1, 2]);
  expect(dijkstras0.nextStepToward).toEqual([-1, 1, 2, 1]);

  let dijkstras1 = Dijkstras(testMapAdjacency, 1);
  expect(dijkstras1.distances).toEqual([1, 0, 2, 1]);
  expect(dijkstras1.nextStepToward).toEqual([0, -1, 0, 3]);

  let dijkstras2 = Dijkstras(testMapAdjacency, 2);
  expect(dijkstras2.distances).toEqual([1, 2, 0, 1]);
  expect(dijkstras2.nextStepToward).toEqual([0, 0, -1, 3]);

  let dijkstras3 = Dijkstras(testMapAdjacency, 3);
  expect(dijkstras3.distances).toEqual([2, 1, 1, 0]);
  expect(dijkstras3.nextStepToward).toEqual([1, 1, 2, -1]);
});

test('4 Players, Similar Numbers, Medium Difficulty', () => {
  // need to be able to specify locations of enemies and players on the map
  let scenario : CombatScenario = {
    enemySetPrimaryByZone : [ EmptyES, EmptyES, EmptyES, new EnemySet(0, 0, 6, 0)],
    enemySetSecondaryByZone : [ EmptyES, EmptyES, EmptyES, EmptyES ],
    playerSetByZone : [ new PlayerSet([
        [1, -1, 2, 2, 0],
        [2, 0, 1, 1, 0],
        [1, 2, 2, 1, 1],
        [1, 1, 2, 1, 2],
      ]), EmptyPS, EmptyPS, EmptyPS],
    startingFocus : 9,
    map: testMap
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