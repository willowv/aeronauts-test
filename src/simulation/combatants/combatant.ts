import { Action } from "./actions/action";
import { Faction } from "../../enum";
import Target from "./target";

export class Combatant extends Target {
  index: number;
  zone: number;
  actions: Action[];
  actionsPerTurn: number;
  actionsTaken: number;

  constructor(
    index: number,
    zone: number,
    actions: Action[],
    actionsPerTurn: number,
    actionsTaken: number,
    health: number,
    maxHealth: number,
    tokens: number[][],
    faction: Faction,
    isSuppressed: boolean
  ) {
    super(health, maxHealth, tokens, faction, isSuppressed);
    this.index = index;
    this.zone = zone;
    this.actions = actions;
    this.actionsPerTurn = actionsPerTurn;
    this.actionsTaken = actionsTaken;
  }

  clone(): Combatant {
    return new Combatant(
      this.index,
      this.zone,
      this.actions,
      this.actionsPerTurn,
      this.actionsTaken,
      this.health,
      this.maxHealth,
      this.tokens,
      this.faction,
      this.isSuppressed
    );
  }
}
export default Combatant;
