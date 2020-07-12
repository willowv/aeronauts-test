import { Action } from "./actions/action";
import { CombatantType } from "../../enum";

export const initialTokens = [
  [0, 0],
  [0, 0],
];

export class Combatant {
  index: number;
  health: number;
  actions: Action[];
  actionsPerTurn: number;
  tokens: number[][];
  zone: number;
  actionsTaken: number;
  isCritical: boolean;
  combatantType: CombatantType;

  constructor(
    index: number,
    health: number,
    actionsPerTurn: number,
    tokens: number[][],
    zone: number,
    actionsTaken: number,
    isCritical: boolean,
    actions: Action[],
    combatantType: CombatantType
  ) {
    this.index = index;
    this.health = health;
    this.actionsPerTurn = actionsPerTurn;
    this.tokens = tokens;
    this.zone = zone;
    this.actionsTaken = actionsTaken;
    this.isCritical = isCritical;
    this.actions = actions;
    this.combatantType = combatantType;
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
      this.zone,
      this.actionsTaken,
      this.isCritical,
      this.actions,
      this.combatantType
    );
  }
}
export default Combatant;
