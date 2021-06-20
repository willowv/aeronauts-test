import Combatant from "./combatant";
import { Token, Boost, Faction } from "../../enum";
import { Action } from "./actions/action";

export const maxPlayerHealth = 15;
export const maxPlayerFocus = 12;

export class Player extends Combatant {
  abilityScores: number[];
  focus: number;
  name: string;

  constructor(
    index: number,
    health: number,
    actionsPerTurn: number,
    tokens: number[][],
    actionsTaken: number,
    abilityScores: number[],
    focus: number,
    actions: Action[],
    name: string,
    isSuppressed: boolean
  ) {
    super(
      index,
      health,
      actionsPerTurn,
      tokens,
      actionsTaken,
      true /* players are always critical */,
      actions,
      Faction.Players,
      isSuppressed,
      maxPlayerHealth
    );
    this.abilityScores = [...abilityScores];
    this.focus = focus;
    this.name = name;
  }

  clone(): Player {
    return new Player(
      this.index,
      this.health,
      this.actionsPerTurn,
      this.tokens,
      this.actionsTaken,
      this.abilityScores,
      this.focus,
      this.actions,
      this.name,
      this.isSuppressed
    );
  }

  // mutates, handles damage causing tokens to appear
  takeDamage(damage: number) {
    if (this.health > 10 && this.health - damage <= 10)
      this.tokens[Token.Action][Boost.Negative] += 1;

    if (this.health > 5 && this.health - damage <= 5)
      this.tokens[Token.Action][Boost.Negative] += 1;

    this.health -= damage;
  }
}
