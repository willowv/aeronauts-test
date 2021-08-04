import { Action } from "./actions/action";
import { CombatantType, Faction } from "../../enum";
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
  advTokens: number;
  disadvTokens: number;
  defTokens: number;
  expTokens: number;
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
    advTokens: number,
    disadvTokens: number,
    defTokens: number,
    expTokens: number,
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
    this.advTokens = advTokens;
    this.disadvTokens = disadvTokens;
    this.defTokens = defTokens;
    this.expTokens = expTokens;
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

  clone(): Combatant {
    return new Combatant(
      this.index,
      this.indexTarget,
      this.health,
      this.actionsPerTurn,
      this.advTokens,
      this.disadvTokens,
      this.defTokens,
      this.expTokens,
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

  effectiveHealth(): number {
    return this.health - this.disadvTokens - this.expTokens;
  }

  isDead(): boolean {
    if (this.isPlayer()) return this.health <= 0;
    else return this.effectiveHealth() <= 0; // enemies are dead when they have more negative tokens than health
  }

  isPlayer(): boolean {
    return this.faction === Faction.Players;
  }

  takeDamage(damage: number) {
    this.health -= Math.max(0, damage - this.damageResistance);
  }

  getBoostForAttackOnMe(): number {
    let defense = Math.min(1, this.defTokens);
    let exposure = Math.min(1, this.expTokens);
    this.defTokens -= defense;
    this.expTokens -= exposure;

    return exposure - defense;
  }

  getBoostForAttackFromMe(): number {
    let advantage = Math.min(1, this.advTokens);
    let disadvantage = Math.min(1, this.disadvTokens);
    this.advTokens -= advantage;
    this.disadvTokens -= disadvantage;

    return advantage - disadvantage;
  }
}
export default Combatant;
