import {
  ScenarioPlayer,
  ScenarioEnemySet,
  Role,
  ScenarioEnemyAirship,
  EnemyLevel,
  ScenarioPlayerAirship,
} from "../simulation/scenario";
import { maxPlayerHealth } from "../simulation/combatants/player";

let scenarioFocus = 12;

export const scenarioGenCon2020 = () => {
  return {
    players: [
      new ScenarioPlayer(
        [1, 1, 0, 0, 2],
        "Captain",
        scenarioFocus,
        maxPlayerHealth,
        Role.Captain
      ),
      new ScenarioPlayer(
        [1, 2, 1, 0, 0],
        "Tinkerer",
        scenarioFocus,
        maxPlayerHealth,
        Role.Engineer
      ),
      new ScenarioPlayer(
        [0, 0, 1, 2, 1],
        "Gunslinger",
        scenarioFocus,
        maxPlayerHealth,
        Role.Interceptor
      ),
      new ScenarioPlayer(
        [1, 0, 2, 0, 1],
        "Muscle",
        scenarioFocus,
        maxPlayerHealth,
        Role.Bomber
      ),
      new ScenarioPlayer(
        [2, 0, 1, 1, 0],
        "Thief",
        scenarioFocus,
        maxPlayerHealth,
        Role.Interceptor
      ),
    ],
    isAirCombat: true,
    playerAirship: new ScenarioPlayerAirship(0, 1),
    enemyAirship: new ScenarioEnemyAirship(EnemyLevel.Scary),
    enemySet: new ScenarioEnemySet([0, 0, 0, 0]),
    reports: [],
  };
};
