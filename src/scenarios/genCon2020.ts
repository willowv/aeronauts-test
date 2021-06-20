import {
  ScenarioPlayer,
  ScenarioEnemySet,
} from "../simulation/scenario";
import {
  Attack
} from "../simulation/combatants/actions/playerActions";
import {
  maxPlayerFocus,
  maxPlayerHealth,
} from "../simulation/combatants/player";

export const scenarioGenCon2020 = () => {
  return {
    players: [
      new ScenarioPlayer(
        [1, 1, 0, 0, 2],
        Attack,
        "Captain",
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [1, 2, 1, 0, 0],
        Attack,
        "Tinkerer",
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [0, 0, 1, 2, 1],
        Attack,
        "Gunslinger",
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [1, 0, 2, 0, 1],
        Attack,
        "Muscle",
        maxPlayerFocus,
        maxPlayerHealth
      ),
      new ScenarioPlayer(
        [2, 0, 1, 1, 0],
        Attack,
        "Thief",
        maxPlayerFocus,
        maxPlayerHealth
      ),
    ],
    enemySet: new ScenarioEnemySet([2, 0, 0, 5]),
    reports: [],
  };
};
