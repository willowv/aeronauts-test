import {
  ScenarioPlayer,
  EmptyEnemySet
} from "../simulation/scenario";
import {
  Pistol,
  Shotgun,
  HeavyMelee,
} from "../simulation/combatants/actions/playerActions";
import {
  maxPlayerFocus,
  maxPlayerHealth,
} from "../simulation/combatants/player";
import { CombatMap } from "../simulation/map/map";

export const airTest1 = () => {
  return {
    players: [
      new ScenarioPlayer(
        [1, 1, 0, 0, 2],
        Pistol,
        "Captain",
        9,
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [1, 2, 1, 0, 0],
        Shotgun,
        "Engineer",
        9,
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [0, 0, 1, 2, 1],
        Pistol,
        "Hotshot",
        0,
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [1, 0, 2, 0, 1],
        HeavyMelee,
        "Bomber",
        0,
        maxPlayerFocus,
        maxPlayerHealth
      ),
    ],
    npcSetsByZone: [
      EmptyEnemySet(),
      EmptyEnemySet(),
      EmptyEnemySet(),
      EmptyEnemySet(),
      EmptyEnemySet(),
      EmptyEnemySet(),
      EmptyEnemySet(),
      EmptyEnemySet(),
      EmptyEnemySet(),
      EmptyEnemySet(),
      EmptyEnemySet()
    ],
    map: new CombatMap(
      ["PC Zone 1", "PC Zone 2", "PC Zone 3", "PC Zone 4", "NPC Zone 1", "NPC Zone 2", "NPC Zone 3", "NPC Zone 4", "Neutral Zone", "PC Airship", "NPC Airship"],
      [
        [false, true, false, true, false, false, false, false, true, false, false],
        [true, false, true, false, false, false, false, false, true, false, false],
        [false, true, false, true, false, false, false, false, true, false, false],
        [true, false, true, false, false, false, false, false, true, false, false],
        [false, false, false, false, false, true, false, true, true, false, false],
        [false, false, false, false, true, false, true, false, true, false, false],
        [false, false, false, false, false, true, false, true, true, false, false],
        [false, false, false, false, true, false, true, false, true, false, false],
        [true, true, true, true, true, true, true, true, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false],
      ]
    ),
    selectedZone: 0,
    reports: [],
  };
};
