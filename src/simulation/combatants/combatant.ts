import { Action } from "./actions/action";
import { Faction } from "../../enum";

export const initialTokens = () => [
  [0, 0],
  [0, 0],
];

export class Combatant {
  index: number;
  health: number;
  actions: Action[];
  actionsPerTurn: number;
  tokens: number[][];
  actionsTaken: number;
  isCritical: boolean;
  faction: Faction;
  isSuppressed: boolean;
  maxHealth: number;

  constructor(
    index: number,
    health: number,
    actionsPerTurn: number,
    tokens: number[][],
    actionsTaken: number,
    isCritical: boolean,
    actions: Action[],
    faction: Faction,
    isSuppressed: boolean,
    maxHealth: number
  ) {
    this.index = index;
    this.health = health;
    this.actionsPerTurn = actionsPerTurn;
    this.tokens = tokens;
    this.actionsTaken = actionsTaken;
    this.isCritical = isCritical;
    this.actions = actions;
    this.faction = faction;
    this.isSuppressed = isSuppressed;
    this.maxHealth = maxHealth;
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  clone(): Combatant {
    return new Combatant(
      this.index,
      this.health,
      this.actionsPerTurn,
      this.tokens,
      this.actionsTaken,
      this.isCritical,
      this.actions,
      this.faction,
      this.isSuppressed,
      this.maxHealth
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
