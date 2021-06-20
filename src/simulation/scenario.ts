import Combatant, { initialTokens } from "../simulation/combatants/combatant";
import { Player } from "../simulation/combatants/player";
import { CombatState } from "./state";
import { Action } from "../simulation/combatants/actions/action";
import {
  EnemyAdvancedAttack,
  EnemyBasicAttack,
} from "../simulation/combatants/actions/npcActions";
import { Faction } from "../enum";

export class Scenario {
  enemySet: ScenarioEnemySet;
  players: ScenarioPlayer[];

  constructor(
    enemies: ScenarioEnemySet,
    players: ScenarioPlayer[]
  ) {
    this.enemySet = enemies;
    this.players = players;
  }
}

export class ScenarioPlayer {
  abilityScores: number[];
  weapon: Action;
  name: string;
  focus: number;
  health: number;

  constructor(
    abilityScores: number[],
    weapon: Action,
    name: string,
    focus: number,
    health: number
  ) {
    this.abilityScores = abilityScores;
    this.weapon = weapon;
    this.name = name;
    this.focus = focus;
    this.health = health;
  }

  clone() {
    return new ScenarioPlayer(
      this.abilityScores,
      this.weapon,
      this.name,
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

const CreateNormalEnemy = (index: number, isCritical: boolean) =>
  new Combatant(
    index,
    4,
    1,
    initialTokens(),
    0,
    isCritical,
    [EnemyBasicAttack],
    Faction.Enemies,
    false,
    4
  );
const CreateDangerousEnemy = (
  index: number,
  isCritical: boolean
) =>
  new Combatant(
    index,
    8,
    1,
    initialTokens(),
    0,
    isCritical,
    [EnemyAdvancedAttack],
    Faction.Enemies,
    false,
    8
  );
const CreateToughEnemy = (index: number, isCritical: boolean) =>
  new Combatant(
    index,
    12,
    1,
    initialTokens(),
    0,
    isCritical,
    [EnemyAdvancedAttack],
    Faction.Enemies,
    false,
    12
  );
const CreateScaryEnemy = (index: number, isCritical: boolean) =>
  new Combatant(
    index,
    16,
    2,
    initialTokens(),
    0,
    isCritical,
    [EnemyAdvancedAttack],
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

function EnemiesFromScenarioEnemySet(
  enemySet: ScenarioEnemySet
): Combatant[] {
  let enemyStartingIndex = 0;
  let enemies: Combatant[] = [];
  enemySet.countByCombatantType.forEach((count, combatantType) => {
    let createEnemy = CreateEnemyByType[combatantType];
    for (let i = 0; i < count; i++)
      enemies.push(createEnemy(enemyStartingIndex + i, true));

    enemyStartingIndex += count;
  });
  return enemies;
}

export function InitialStateFromScenario(scenario: Scenario): CombatState {
  let players = PlayersFromScenarioPlayers(scenario.players);
  let enemies = EnemiesFromScenarioEnemySet(scenario.enemySet);

  return new CombatState(players, enemies);
}
