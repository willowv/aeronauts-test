import Combatant, { initialTokens } from "../simulation/combatants/combatant";
import { Player } from "../simulation/combatants/player";
import { CombatState } from "./state";
import { Action } from "../simulation/combatants/actions/action";
import {
  AdvancedAA,
  AdvancedBombs,
  AdvancedCannons,
  AdvancedFighterGuns,
  AdvancedTorps,
  BasicAA,
  BasicBombs,
  BasicCannons,
  BasicFighterGuns,
  BasicTorps,
  EnemyAdvancedAttack,
  EnemyBasicAttack,
} from "../simulation/combatants/actions/npcActions";
import { CombatantType, Faction } from "../enum";
import {
  PlayerAI,
  PlayerBomberAI,
  PlayerCaptainAI,
  PlayerEngineerAI,
  PlayerInterceptorAI,
} from "./combatants/ai/playerAi";
import { EnemyAI, EnemyFighterAI } from "./combatants/ai/enemyAi";
import { PlayerAirship } from "./airships/playerAirship";
import { Quadrant } from "./airships/airship";
import { EnemyAirship } from "./airships/enemyAirship";
import {
  AntiAir,
  Attack,
  AugmentSystems,
  Bombs,
  Cannons,
  Defend,
  FighterGuns,
  Torpedoes,
} from "./combatants/actions/playerActions";

export enum EnemyLevel {
  Normal = 0,
  Dangerous,
  Tough,
  Scary,
}

export const enemyLevelStrings = ["Normal", "Dangerous", "Tough", "Scary"];

export enum Role {
  Ground = 0,
  Captain,
  Engineer,
  Interceptor,
  Bomber,
}

export const roleStrings: string[] = [
  "Ground",
  "Captain",
  "Engineer",
  "Interceptor",
  "Bomber",
];

export class Scenario {
  isAirCombat: boolean;
  enemySet: ScenarioEnemySet;
  players: ScenarioPlayer[];
  enemyAirship: ScenarioEnemyAirship | null;
  playerAirship: ScenarioPlayerAirship | null;

  constructor(
    isAirCombat: boolean,
    enemies: ScenarioEnemySet,
    players: ScenarioPlayer[],
    enemyAirship: ScenarioEnemyAirship | null,
    playerAirship: ScenarioPlayerAirship | null
  ) {
    this.isAirCombat = isAirCombat;
    this.enemySet = enemies;
    this.players = players;
    this.enemyAirship = enemyAirship;
    this.playerAirship = playerAirship;
  }

  generatePlayers(): Player[] {
    let outputPlayers: Player[] = this.players.map(
      (scenarioPlayer: ScenarioPlayer, index: number) => {
        let actions = [Attack, Defend];
        let damageResistance = 0;
        let combatantType = CombatantType.Ground;
        let ai = new PlayerAI();
        if (this.isAirCombat && this.playerAirship !== null) {
          if (this.playerAirship.indexPlayerCaptain === index) {
            actions = [Cannons, Torpedoes, AntiAir];
            combatantType = CombatantType.Crew;
            ai = new PlayerCaptainAI();
          } else if (this.playerAirship.indexPlayerEngineer === index) {
            actions = [AugmentSystems];
            combatantType = CombatantType.Crew;
            ai = new PlayerEngineerAI();
          } else {
            actions = [FighterGuns, Bombs];
            combatantType = CombatantType.Fighter;
            if (scenarioPlayer.role === Role.Bomber) {
              damageResistance = 1;
              ai = new PlayerBomberAI();
            } else ai = new PlayerInterceptorAI();
          }
        }
        return new Player(
          index,
          null,
          scenarioPlayer.health,
          1,
          initialTokens(),
          0,
          scenarioPlayer.abilityScores,
          scenarioPlayer.focus,
          actions,
          scenarioPlayer.name,
          ai,
          combatantType,
          damageResistance
        );
      }
    );
    return outputPlayers;
  }

  getInitialCombatState(): CombatState {
    let players = this.generatePlayers();
    let enemies = this.enemySet.generateEnemies(this.isAirCombat);
    let playerAirship = this.playerAirship?.generatePlayerAirship() ?? null;
    let enemyAirship = this.enemyAirship?.generateEnemyAirship() ?? null;

    return new CombatState(
      players,
      playerAirship,
      enemies,
      enemyAirship,
      this.isAirCombat
    );
  }
}

export class ScenarioEnemyAirship {
  level: EnemyLevel;

  constructor(level: EnemyLevel) {
    this.level = level;
  }

  generateEnemyAirship(): EnemyAirship {
    let health, numBasicActions, numAdvancedActions;
    switch (this.level) {
      case EnemyLevel.Normal:
        health = 6;
        numBasicActions = 1;
        numAdvancedActions = 1;
        break;
      case EnemyLevel.Dangerous:
        health = 7;
        numBasicActions = 0;
        numAdvancedActions = 2;
        break;
      case EnemyLevel.Tough:
        health = 8;
        numBasicActions = 0;
        numAdvancedActions = 3;
        break;
      case EnemyLevel.Scary:
        health = 9;
        numBasicActions = 0;
        numAdvancedActions = 4;
        break;
    }
    return new EnemyAirship(
      Quadrant.A,
      [health, health, health, health],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [false, false, false, false],
      numBasicActions,
      numAdvancedActions,
      [BasicCannons, BasicTorps, BasicAA],
      [AdvancedCannons, AdvancedTorps, AdvancedAA],
      0,
      null
    );
  }
}

export class ScenarioPlayerAirship {
  indexPlayerCaptain: number;
  indexPlayerEngineer: number;

  constructor(indexPlayerCaptain: number, indexPlayerEngineer: number) {
    this.indexPlayerCaptain = indexPlayerCaptain;
    this.indexPlayerEngineer = indexPlayerEngineer;
  }

  generatePlayerAirship(): PlayerAirship {
    return new PlayerAirship(
      Quadrant.A,
      [8, 8, 8, 8],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [false, false, false, false],
      this.indexPlayerCaptain,
      this.indexPlayerEngineer
    );
  }
}

export class ScenarioPlayer {
  abilityScores: number[];
  weapon: Action;
  name: string;
  focus: number;
  health: number;
  role: Role;

  constructor(
    abilityScores: number[],
    weapon: Action,
    name: string,
    focus: number,
    health: number,
    role: Role
  ) {
    this.abilityScores = abilityScores;
    this.weapon = weapon;
    this.name = name;
    this.focus = focus;
    this.health = health;
    this.role = role;
  }

  clone() {
    return new ScenarioPlayer(
      this.abilityScores,
      this.weapon,
      this.name,
      this.focus,
      this.health,
      this.role
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

  generateEnemies(isAirCombat: boolean): Combatant[] {
    let enemyStartingIndex = 0;
    let enemies: Combatant[] = [];
    this.countByCombatantType.forEach((count, combatantType) => {
      for (let i = 0; i < count; i++) {
        let health;
        let ai = isAirCombat ? new EnemyFighterAI() : new EnemyAI();
        let type = isAirCombat ? CombatantType.Fighter : CombatantType.Ground;
        let actions = isAirCombat
          ? [AdvancedFighterGuns, AdvancedBombs]
          : [EnemyAdvancedAttack];
        let actionsPerTurn = 1;
        switch (combatantType as EnemyLevel) {
          case EnemyLevel.Normal:
          default:
            health = 4;
            actions = isAirCombat
              ? [BasicFighterGuns, BasicBombs]
              : [EnemyBasicAttack];
            break;
          case EnemyLevel.Dangerous:
            health = 8;
            break;
          case EnemyLevel.Tough:
            health = 12;
            break;
          case EnemyLevel.Scary:
            health = 16;
            actionsPerTurn = 2;
            break;
        }
        let enemy = new Combatant(
          enemyStartingIndex + i,
          null,
          health,
          actionsPerTurn,
          initialTokens(),
          0,
          true,
          actions,
          Faction.Enemies,
          health,
          ai,
          type,
          0
        );
        enemies.push(enemy);
      }

      enemyStartingIndex += count;
    });
    return enemies;
  }
}

export const EmptyEnemySet = () => new ScenarioEnemySet([0, 0, 0, 0]);
