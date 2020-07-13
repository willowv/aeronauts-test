import Combatant, { initialTokens } from "../simulation/combatants/combatant";
import { Player, initialPlayerHealth } from "../simulation/combatants/player";
import { GameState } from "./state";
import { GameMap } from "../simulation/map/map";
import { Action } from "../simulation/combatants/actions/action";
import { NPCBasicAttack } from "../simulation/combatants/actions/npcActions";
import { CombatantType } from "../enum";

export class CombatScenario {
  enemySetByZone: EnemySet[];
  players: PlayerStub[];
  startingFocus: number;
  map: GameMap;

  constructor(
    enemySetByZone: EnemySet[],
    players: PlayerStub[],
    startingFocus: number,
    map: GameMap
  ) {
    this.enemySetByZone = enemySetByZone;
    this.players = players;
    this.startingFocus = startingFocus;
    this.map = map;
  }
}

export class PlayerStub {
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
    return new PlayerStub(
      this.abilityScores,
      this.weapon,
      this.name,
      this.zone
    );
  }
}

export class EnemySet {
  count: number[];

  constructor(count: number[]) {
    this.count = count;
  }

  clone() {
    return new EnemySet(this.count);
  }

  total(): number {
    return (
      this.count[CombatantType.Normal] +
      this.count[CombatantType.Dangerous] +
      this.count[CombatantType.Tough] +
      this.count[CombatantType.Scary]
    );
  }
}

export const EmptyES = new EnemySet([0, 0, 0, 0]);

export function rgplayerFromPlayerStubs(
  playerStubs: PlayerStub[],
  startingFocus: number
) {
  let rgplayer: Player[] = playerStubs.map(
    (playerStub: PlayerStub, index: number) => {
      return new Player(
        index,
        initialPlayerHealth,
        2,
        initialTokens,
        playerStub.zone,
        0,
        playerStub.abilityScores,
        startingFocus,
        [playerStub.weapon],
        playerStub.name
      );
    }
  );
  return rgplayer;
}

const enemyNormal = (index: number, zone: number, isCritical: boolean) =>
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
const enemyDangerous = (index: number, zone: number, isCritical: boolean) =>
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
const enemyTough = (index: number, zone: number, isCritical: boolean) =>
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
const enemyScary = (index: number, zone: number, isCritical: boolean) =>
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

function rgEnemyByType(
  startingIndex: number,
  cenemy: number,
  fnEnemy: (index: number, zone: number, isCritical: boolean) => Combatant,
  zone: number,
  isCritical: boolean
) {
  let rgenemy = [];
  for (let i = 0; i < cenemy; i++)
    rgenemy.push(fnEnemy(startingIndex + i, zone, isCritical));

  return rgenemy;
}

export function rgEnemyFromEnemySet(
  i: number,
  enemySet: EnemySet,
  zone: number,
  isCritical: boolean
) {
  let rgenemy: Combatant[] = [];
  let startingIndex = i;
  rgenemy = rgenemy.concat(
    rgEnemyByType(
      startingIndex,
      enemySet.count[CombatantType.Normal],
      enemyNormal,
      zone,
      isCritical
    )
  );
  startingIndex += enemySet.count[CombatantType.Normal];
  rgenemy = rgenemy.concat(
    rgEnemyByType(
      startingIndex,
      enemySet.count[CombatantType.Dangerous],
      enemyDangerous,
      zone,
      isCritical
    )
  );
  startingIndex += enemySet.count[CombatantType.Dangerous];
  rgenemy = rgenemy.concat(
    rgEnemyByType(
      startingIndex,
      enemySet.count[CombatantType.Tough],
      enemyTough,
      zone,
      isCritical
    )
  );
  startingIndex += enemySet.count[CombatantType.Tough];
  rgenemy = rgenemy.concat(
    rgEnemyByType(
      startingIndex,
      enemySet.count[CombatantType.Scary],
      enemyScary,
      zone,
      isCritical
    )
  );
  return rgenemy;
}

export function InitialStateFromScenario(scenario: CombatScenario): GameState {
  let rgplayer = rgplayerFromPlayerStubs(
    scenario.players,
    scenario.startingFocus
  );
  let npcIndex = 0;
  let rgenemy: Combatant[] = [];
  scenario.enemySetByZone.forEach((enemySetPrimary: EnemySet, zone: number) => {
    rgenemy = rgenemy.concat(
      rgEnemyFromEnemySet(
        npcIndex,
        enemySetPrimary,
        zone,
        true /* primary enemies are critical */
      )
    );
    npcIndex += enemySetPrimary.total();
  });
  return new GameState(rgplayer, rgenemy, scenario.map);
}
