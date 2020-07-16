import Combatant, { initialTokens } from "../simulation/combatants/combatant";
import { Player, initialPlayerHealth } from "../simulation/combatants/player";
import { CombatState } from "./state";
import { GameMap } from "../simulation/map/map";
import { Action } from "../simulation/combatants/actions/action";
import { NPCBasicAttack } from "../simulation/combatants/actions/npcActions";
import { CombatantType } from "../enum";

export class Scenario {
  enemySetByZone: ScenarioEnemySet[];
  players: ScenarioPlayer[];
  startingFocus: number;
  map: GameMap;

  constructor(
    enemySetByZone: ScenarioEnemySet[],
    players: ScenarioPlayer[],
    startingFocus: number,
    map: GameMap
  ) {
    this.enemySetByZone = enemySetByZone;
    this.players = players;
    this.startingFocus = startingFocus;
    this.map = map;
  }
}

export class ScenarioPlayer {
  abilityScores: number[];
  weapon: Action;
  name: string;
  zone: number;

  constructor(
    abilityScores: number[],
    weapon: Action,
    name: string,
    zone: number
  ) {
    this.abilityScores = abilityScores;
    this.weapon = weapon;
    this.name = name;
    this.zone = zone;
  }

  clone() {
    return new ScenarioPlayer(
      this.abilityScores,
      this.weapon,
      this.name,
      this.zone
    );
  }
}

export class ScenarioEnemySet {
  countByCombatantType: number[];

  constructor(count: number[]) {
    this.countByCombatantType = count;
  }

  clone() {
    return new ScenarioEnemySet(this.countByCombatantType);
  }
}

export const EmptyEnemySet = () => new ScenarioEnemySet([0, 0, 0, 0]);

function PlayersFromScenarioPlayers(
  scenarioPlayers: ScenarioPlayer[],
  startingFocus: number
): Player[] {
  let players: Player[] = scenarioPlayers.map(
    (scenarioPlayer: ScenarioPlayer, index: number) => {
      return new Player(
        index,
        initialPlayerHealth,
        2,
        initialTokens,
        scenarioPlayer.zone,
        0,
        scenarioPlayer.abilityScores,
        startingFocus,
        [scenarioPlayer.weapon],
        scenarioPlayer.name
      );
    }
  );
  return players;
}

const CreateNormalEnemy = (index: number, zone: number, isCritical: boolean) =>
  new Combatant(
    index,
    4,
    1,
    initialTokens,
    zone,
    0,
    isCritical,
    [NPCBasicAttack],
    CombatantType.Normal
  );
const CreateDangerousEnemy = (
  index: number,
  zone: number,
  isCritical: boolean
) =>
  new Combatant(
    index,
    8,
    2,
    initialTokens,
    zone,
    0,
    isCritical,
    [NPCBasicAttack],
    CombatantType.Dangerous
  );
const CreateToughEnemy = (index: number, zone: number, isCritical: boolean) =>
  new Combatant(
    index,
    12,
    2,
    initialTokens,
    zone,
    0,
    isCritical,
    [NPCBasicAttack],
    CombatantType.Tough
  );
const CreateScaryEnemy = (index: number, zone: number, isCritical: boolean) =>
  new Combatant(
    index,
    16,
    4,
    initialTokens,
    zone,
    0,
    isCritical,
    [NPCBasicAttack],
    CombatantType.Scary
  );

const CreateEnemyByType = [
  CreateNormalEnemy,
  CreateDangerousEnemy,
  CreateToughEnemy,
  CreateScaryEnemy,
];

function EnemiesFromScenarioEnemySetByZone(
  enemySetByZone: ScenarioEnemySet[]
): Combatant[] {
  let enemyStartingIndex = 0;
  let enemies: Combatant[] = [];
  enemySetByZone.forEach((enemySet, zone) => {
    enemySet.countByCombatantType.forEach((count, combatantType) => {
      let createEnemy = CreateEnemyByType[combatantType];
      for (let i = 0; i < count; i++)
        enemies.push(createEnemy(enemyStartingIndex + i, zone, true));

      enemyStartingIndex += count;
    });
  });
  return enemies;
}

export function InitialStateFromScenario(scenario: Scenario): CombatState {
  let players = PlayersFromScenarioPlayers(
    scenario.players,
    scenario.startingFocus
  );

  let enemies = EnemiesFromScenarioEnemySetByZone(scenario.enemySetByZone);

  return new CombatState(players, enemies, scenario.map);
}
