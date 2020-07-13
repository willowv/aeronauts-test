import Combatant from "./combatant";
import { Token, Boost, CombatantType } from "../../enum";
import { Action } from "./actions/action";

export const initialPlayerHealth = 15;

export class Player extends Combatant {
  abilityScores: number[];
  focus: number;
  name: string;

  constructor(
    index: number,
    health: number,
    actionsPerTurn: number,
    tokens: number[][],
    zone: number,
    actionsTaken: number,
    picac: number[],
    focus: number,
    actions: Action[],
    name: string
  ) {
    super(
      index,
      health,
      actionsPerTurn,
      tokens,
      zone,
      actionsTaken,
      true /* players are always critical */,
      actions,
      CombatantType.Player
    );
    this.abilityScores = [...picac];
    this.focus = focus;
    this.name = name;
  }

  clone(): Player {
    return new Player(
      this.index,
      this.health,
      this.actionsPerTurn,
      this.tokens,
      this.zone,
      this.actionsTaken,
      this.abilityScores,
      this.focus,
      this.actions,
      this.name
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