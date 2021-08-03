import {
  ScenarioPlayer,
  ScenarioEnemySet,
  Role,
  ScenarioPlayerAirship,
  ScenarioEnemyAirship,
  EnemyLevel,
} from "../simulation/scenario";
import { Attack } from "../simulation/combatants/actions/playerActions";
import {
  maxPlayerFocus,
  maxPlayerHealth,
} from "../simulation/combatants/player";

export const scenarioGenCon2020 = () => {
  return {
    isAirCombat: true,
    playerAirship: new ScenarioPlayerAirship(0, 1),
    players: [
      new ScenarioPlayer(
        [1, 1, 0, 0, 2],
        Attack,
        "Captain",
        maxPlayerFocus,
        maxPlayerHealth,
        Role.Captain
      ),
      new ScenarioPlayer(
        [1, 2, 1, 0, 0],
        Attack,
        "Tinkerer",
        maxPlayerFocus,
        maxPlayerHealth,
        Role.Engineer
      ),
      new ScenarioPlayer(
        [0, 0, 1, 2, 1],
        Attack,
        "Gunslinger",
        maxPlayerFocus,
        maxPlayerHealth,
        Role.Interceptor
      ),
      new ScenarioPlayer(
        [1, 0, 2, 0, 1],
        Attack,
        "Muscle",
        maxPlayerFocus,
        maxPlayerHealth,
        Role.Bomber
      ),
    ],
    enemyAirship: null, // new ScenarioEnemyAirship(EnemyLevel.Scary),
    enemySet: new ScenarioEnemySet([0, 0, 0, 0]),
    reports: [],
  };
};
