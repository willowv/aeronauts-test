import { ScenarioPlayer, ScenarioEnemySet, Role } from "../simulation/scenario";
import { Attack } from "../simulation/combatants/actions/playerActions";
import {
  maxPlayerFocus,
  maxPlayerHealth,
} from "../simulation/combatants/player";

export const scenarioGenCon2020 = () => {
  return {
    isAirCombat: false,
    playerAirship: null,
    enemyAirship: null,
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
      new ScenarioPlayer(
        [2, 0, 1, 1, 0],
        Attack,
        "Thief",
        maxPlayerFocus,
        maxPlayerHealth,
        Role.Interceptor
      ),
    ],
    enemySet: new ScenarioEnemySet([2, 0, 0, 5]),
    reports: [],
  };
};
