import { Action } from "./actions/action";
import { Boost, CombatantType, Faction } from "../../enum";
import { AI } from "./ai/ai";
import { Actor } from "./actor";
import { Targetable } from "./targetable";
import { CombatState } from "../state";

export const initialTokens = () => [
  [0, 0],
  [0, 0],
];

export class Combatant implements Actor, Targetable {
  index: number;
  indexTarget: number | null;
  health: number;
  actions: Action[];
  actionsPerTurn: number;
  tokens: number[][];
  actionsTaken: number;
  faction: Faction;
  maxHealth: number;
  ai: AI;
  type: CombatantType;

  constructor(
    index: number,
    indexTarget: number | null,
    health: number,
    actionsPerTurn: number,
    tokens: number[][],
    actionsTaken: number,
    actions: Action[],
    faction: Faction,
    maxHealth: number,
    ai: AI,
    type: CombatantType
  ) {
    this.index = index;
    this.indexTarget = indexTarget;
    this.health = health;
    this.actionsPerTurn = actionsPerTurn;
    this.tokens = tokens;
    this.actionsTaken = actionsTaken;
    this.actions = actions;
    this.faction = faction;
    this.maxHealth = maxHealth;
    this.ai = ai;
    this.type = type;
  }
  isCritical(): boolean {
    throw new Error("Method not implemented.");
  }
  getDefenseTokens(boost: Boost): number {
    throw new Error("Method not implemented.");
  }
  setDefenseTokens(boost: Boost, num: number): void {
    throw new Error("Method not implemented.");
  }
  getBoostVsAttackAndConsumeTokens(): number {
    throw new Error("Method not implemented.");
  }
  getTargetType(): CombatantType {
    throw new Error("Method not implemented.");
  }
  canAct(state: CombatState): boolean {
    throw new Error("Method not implemented.");
  }
  getActionTokens(boost: Boost): number {
    throw new Error("Method not implemented.");
  }
  setActionTokens(boost: Boost, num: number): void {
    throw new Error("Method not implemented.");
  }
  getActions(): Action[] {
    throw new Error("Method not implemented.");
  }
  getActionsPerTurn(): number {
    throw new Error("Method not implemented.");
  }
  getFaction(): Faction {
    throw new Error("Method not implemented.");
  }
  getActionAndTarget(state: CombatState): {
    action: Action;
    targetable: Targetable;
  } {
    throw new Error("Method not implemented.");
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  clone(): Combatant {
    return new Combatant(
      this.index,
      this.indexTarget,
      this.health,
      this.actionsPerTurn,
      this.tokens,
      this.actionsTaken,
      this.actions,
      this.faction,
      this.maxHealth,
      this.ai,
      this.type
    );
  }

  isPlayer(): boolean {
    return this.faction === Faction.Players;
  }

  takeDamage(damage: number) {
    this.health -= damage;
  }
}
export default Combatant;
