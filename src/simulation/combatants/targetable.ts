import { Boost, CombatantType, Faction } from "../../enum";

export const initialTokens = () => [0, 0];

export interface Targetable {
  isDead(): boolean;
  isCritical(): boolean;
  takeDamage(amount: number): void;
  getHealth(): number;
  getMaxHealth(): number;
  addHealth(amount: number): void;
  getDefenseTokens(boost: Boost): number;
  setDefenseTokens(boost: Boost, num: number): void;
  getBoostVsAttackAndConsumeTokens(): number;
  getTargetType(): CombatantType;
  getFaction(): Faction;
  getIndexTargetable(): number;
  clone(): Targetable;
}
