import { Action } from "./actions/action";
import { Boost, CombatantType, Faction, Token } from "../../enum";
import { AI } from "./ai/ai";

export const initialTokens = () => [
  [0, 0],
  [0, 0],
];

export class Combatant {
  index: number;
  indexTarget: number | null;
  health: number;
  actions: Action[];
  actionsPerTurn: number;
  tokens: number[][];
  actionsTaken: number;
  isCritical: boolean;
  faction: Faction;
  maxHealth: number;
  ai: AI;
  type: CombatantType;
  damageResistance: number;
  partialDamage: number;
  fullDamage: number;

  constructor(
    index: number,
    indexTarget: number | null,
    health: number,
    actionsPerTurn: number,
    tokens: number[][],
    actionsTaken: number,
    isCritical: boolean,
    actions: Action[],
    faction: Faction,
    maxHealth: number,
    ai: AI,
    type: CombatantType,
    damageResistance: number,
    basicDamage: number,
    advancedDamage: number
  ) {
    this.index = index;
    this.indexTarget = indexTarget;
    this.health = health;
    this.actionsPerTurn = actionsPerTurn;
    this.tokens = tokens;
    this.actionsTaken = actionsTaken;
    this.isCritical = isCritical;
    this.actions = actions;
    this.faction = faction;
    this.maxHealth = maxHealth;
    this.ai = ai;
    this.type = type;
    this.damageResistance = damageResistance;
    this.partialDamage = basicDamage;
    this.fullDamage = advancedDamage;
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
      this.isCritical,
      this.actions,
      this.faction,
      this.maxHealth,
      this.ai,
      this.type,
      this.damageResistance,
      this.partialDamage,
      this.fullDamage
    );
  }

  isPlayer(): boolean {
    return this.faction === Faction.Players;
  }

  takeDamage(damage: number) {
    this.health -= Math.max(0, damage - this.damageResistance);
  }

  getBoostForAttackOnMe(): number {
    let defense = Math.min(1, this.tokens[Token.Defense][Boost.Positive]);
    let exposure = Math.min(1, this.tokens[Token.Defense][Boost.Negative]);
    this.tokens[Token.Defense][Boost.Positive] -= defense;
    this.tokens[Token.Defense][Boost.Negative] -= exposure;

    return exposure - defense;
  }

  getBoostForAttackFromMe(): number {
    let advantage = Math.min(1, this.tokens[Token.Action][Boost.Positive]);
    let disadvantage = Math.min(1, this.tokens[Token.Action][Boost.Negative]);
    this.tokens[Token.Action][Boost.Positive] -= advantage;
    this.tokens[Token.Action][Boost.Negative] -= disadvantage;

    return advantage - disadvantage;
  }
}
export default Combatant;
