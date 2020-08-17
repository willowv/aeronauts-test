import {
  ScenarioPlayer,
  EmptyEnemySet,
  ScenarioEnemySet,
} from "../simulation/scenario";
import {
  Pistol,
  Shotgun,
  HeavyMelee,
  LightMelee,
} from "../simulation/combatants/actions/playerActions";
import {
  maxPlayerFocus,
  maxPlayerHealth,
} from "../simulation/combatants/player";
import { CombatMap } from "../simulation/map/map";
import {
  TerrainCover,
  TerrainUneven,
  TerrainExposed,
  TerrainUnstable,
  TerrainDefault,
  TerrainVantage,
} from "../simulation/map/terrain";

export const scenarioGenCon2020 = () => {
  return {
    players: [
      new ScenarioPlayer(
        [1, 1, 0, 0, 2],
        Pistol,
        "Captain",
        0,
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [1, 2, 1, 0, 0],
        Shotgun,
        "Tinkerer",
        0,
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [0, 0, 1, 2, 1],
        Pistol,
        "Gunslinger",
        0,
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [1, 0, 2, 0, 1],
        HeavyMelee,
        "Muscle",
        0,
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [2, 0, 1, 1, 0],
        LightMelee,
        "Thief",
        0,
        maxPlayerFocus,
        maxPlayerHealth
      ),
    ],
    npcSetsByZone: [
      EmptyEnemySet(),
      EmptyEnemySet(),
      new ScenarioEnemySet([2, 0, 0, 0]),
      new ScenarioEnemySet([0, 0, 0, 1]),
      new ScenarioEnemySet([2, 0, 0, 0]),
      new ScenarioEnemySet([2, 0, 0, 0]),
      EmptyEnemySet(),
    ],
    map: new CombatMap(
      [
        TerrainCover,
        TerrainUneven,
        TerrainExposed,
        TerrainUnstable,
        TerrainDefault,
        TerrainDefault,
        TerrainVantage,
      ],
      [
        [false, true, true, false, true, false, false],
        [true, false, false, true, false, false, false],
        [true, false, false, false, false, true, false],
        [false, true, false, false, false, true, false],
        [true, false, false, false, false, true, false],
        [false, false, true, true, true, false, true],
        [false, false, false, false, false, true, false],
      ]
    ),
    selectedZone: 0,
    reports: [],
  };
};
