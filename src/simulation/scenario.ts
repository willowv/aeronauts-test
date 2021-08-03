import Combatant, { initialTokens } from "../simulation/combatants/combatant";
import { Player } from "../simulation/combatants/player";
import { CombatState } from "./state";
import { Action } from "../simulation/combatants/actions/action";
import {
  EnemyBombs,
  EnemyFighterGuns,
  EnemyAttack,
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
          damageResistance,
          3,
          5
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
    let health, numActions, partialDamage, fullDamage;
    switch (this.level) {
      case EnemyLevel.Normal:
        health = 9;
        numActions = 2;
        partialDamage = 2;
        fullDamage = 5;
        break;
      case EnemyLevel.Dangerous:
        health = 10;
        numActions = 2;
        partialDamage = 2;
        fullDamage = 5;
        break;
      case EnemyLevel.Tough:
        health = 14;
        numActions = 2;
        partialDamage = 2;
        fullDamage = 5;
        break;
      case EnemyLevel.Scary:
        health = 15;
        numActions = 4;
        partialDamage = 2;
        fullDamage = 4;
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
      numActions,
      0,
      null,
      partialDamage,
      fullDamage
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
        let health, actionsPerTurn, partialDamage, fullDamage;
        let ai = isAirCombat ? new EnemyFighterAI() : new EnemyAI();
        let type = isAirCombat ? CombatantType.Fighter : CombatantType.Ground;
        let actions = isAirCombat
          ? [EnemyFighterGuns, EnemyBombs]
          : [EnemyAttack];
        switch (combatantType as EnemyLevel) {
          case EnemyLevel.Normal:
          default:
            health = 7;
            actionsPerTurn = 1;
            partialDamage = 2;
            fullDamage = 4;
            break;
          case EnemyLevel.Dangerous:
            health = 10;
            actionsPerTurn = 1;
            partialDamage = 3;
            fullDamage = 6;
            break;
          case EnemyLevel.Tough:
            health = 15;
            actionsPerTurn = 3;
            partialDamage = 2;
            fullDamage = 5;
            break;
          case EnemyLevel.Scary:
            health = 26;
            actionsPerTurn = 4;
            partialDamage = 4;
            fullDamage = 6;
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
          0,
          partialDamage,
          fullDamage
        );
        enemies.push(enemy);
      }

      enemyStartingIndex += count;
    });
    return enemies;
  }
}

export const EmptyEnemySet = () => new ScenarioEnemySet([0, 0, 0, 0]);
