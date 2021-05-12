import { Action } from "./actions/action";
import { Faction } from "../../enum";

export const initialTokens = () => [
  [0, 0],
  [0, 0],
];

export class Target {
  health: number;
  maxHealth: number;
  tokens: number[][];
  faction: Faction;
  isSuppressed: boolean;

  constructor(
    health: number,
    maxHealth: number,
    tokens: number[][],
    faction: Faction,
    isSuppressed: boolean,
  ) {
    this.health = health;
    this.maxHealth = maxHealth;
    this.tokens = tokens;
    this.faction = faction;
    this.isSuppressed = isSuppressed;
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  clone(): Target {
    return new Target(
      this.health,
      this.maxHealth,
      this.tokens,
      this.faction,
      this.isSuppressed,
    );
  }

  isPlayer(): boolean {
    return this.faction === Faction.Players;
  }

  takeDamage(damage: number) {
    this.health -= damage;
  }
}
export default Target;