import Combatant, { initialTokens } from "../simulation/combatants/combatant";
import { Player } from "../simulation/combatants/player";
import { CombatState } from "./state";
import { CombatMap } from "../simulation/map/map";
import { Action } from "../simulation/combatants/actions/action";
import {
  EnemyAdvancedMeleeAttack,
  EnemyAdvancedCroakRoar,
  EnemyBasicMeleeAttack,
  EnemyAdvancedLeap,
} from "../simulation/combatants/actions/npcActions";
import { Faction } from "../enum";

export class Scenario {
  enemySetByZone: ScenarioEnemySet[];
  players: ScenarioPlayer[];
  map: CombatMap;

  constructor(
    enemySetByZone: ScenarioEnemySet[],
    players: ScenarioPlayer[],
    map: CombatMap
  ) {
    this.enemySetByZone = enemySetByZone;
    this.players = players;
    this.map = map;
  }
}

export class ScenarioPlayer {
  abilityScores: number[];
  weapon: Action;
  name: string;
  zone: number;
  focus: number;
  health: number;

  constructor(
    abilityScores: number[],
    weapon: Action,
    name: string,
    zone: number,
    focus: number,
    health: number
  ) {
    this.abilityScores = abilityScores;
    this.weapon = weapon;
    this.name = name;
    this.zone = zone;
    this.focus = focus;
    this.health = health;
  }

  clone() {
    return new ScenarioPlayer(
      this.abilityScores,
      this.weapon,
      this.name,
      this.zone,
      this.focus,
      this.health
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
  scenarioPlayers: ScenarioPlayer[]
): Player[] {
  let players: Player[] = scenarioPlayers.map(
    (scenarioPlayer: ScenarioPlayer, index: number) => {
      return new Player(
        index,
        scenarioPlayer.health,
        1,
        initialTokens(),
        scenarioPlayer.zone,
        0,
        scenarioPlayer.abilityScores,
        scenarioPlayer.focus,
        [scenarioPlayer.weapon],
        scenarioPlayer.name,
        false
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
    initialTokens(),
    zone,
    0,
    isCritical,
    [EnemyBasicMeleeAttack],
    Faction.Enemies,
    false,
    4
  );
const CreateDangerousEnemy = (
  index: number,
  zone: number,
  isCritical: boolean
) =>
  new Combatant(
    index,
    8,
    1,
    initialTokens(),
    zone,
    0,
    isCritical,
    [EnemyAdvancedMeleeAttack, EnemyAdvancedCroakRoar, EnemyAdvancedLeap],
    Faction.Enemies,
    false,
    8
  );
const CreateToughEnemy = (index: number, zone: number, isCritical: boolean) =>
  new Combatant(
    index,
    12,
    1,
    initialTokens(),
    zone,
    0,
    isCritical,
    [EnemyAdvancedMeleeAttack, EnemyAdvancedCroakRoar, EnemyAdvancedLeap],
    Faction.Enemies,
    false,
    12
  );
const CreateScaryEnemy = (index: number, zone: number, isCritical: boolean) =>
  new Combatant(
    index,
    16,
    2,
    initialTokens(),
    zone,
    0,
    isCritical,
    [EnemyAdvancedMeleeAttack, EnemyAdvancedCroakRoar, EnemyAdvancedLeap],
    Faction.Enemies,
    false,
    16
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
  let players = PlayersFromScenarioPlayers(scenario.players);
  let enemies = EnemiesFromScenarioEnemySetByZone(scenario.enemySetByZone);

  return new CombatState(players, enemies, scenario.map);
}
