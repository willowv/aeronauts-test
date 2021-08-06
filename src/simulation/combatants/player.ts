import Combatant from "./combatant";
import { Faction, CombatantType, Ability } from "../../enum";
import { AI } from "./ai/ai";

export const maxPlayerHealth = 15;
export const maxPlayerFocus = 12;

export class Player extends Combatant {
  abilityScores: number[];
  focus: number;
  name: string;

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
    abilityScores: number[],
    focus: number,
    name: string,
    ai: AI,
    type: CombatantType,
    damageResistance: number,
    partialDamage: number,
    fullDamage: number
  ) {
    super(
      index,
      indexTarget,
      health,
      actionsPerTurn,
      advTokens,
      disadvTokens,
      defTokens,
      expTokens,
      actionsTaken,
      true /* players are always critical */,
      Faction.Players,
      maxPlayerHealth,
      ai,
      type,
      damageResistance,
      partialDamage,
      fullDamage
    );
    this.abilityScores = [...abilityScores];
    this.focus = focus;
    this.name = name;
  }

  clone(): Player {
    return new Player(
      this.index,
      this.indexTarget,
      this.health,
      this.actionsPerTurn,
      this.advTokens,
      this.disadvTokens,
      this.defTokens,
      this.expTokens,
      this.actionsTaken,
      this.abilityScores,
      this.focus,
      this.name,
      this.ai,
      this.type,
      this.damageResistance,
      this.partialDamage,
      this.fullDamage
    );
  }

  // mutates, handles damage causing tokens to appear
  takeDamage(incomingDamage: number) {
    let damage = Math.max(0, incomingDamage - this.damageResistance);

    if (this.health > 10 && this.health - damage <= 10) this.disadvTokens += 1;

    if (this.health > 5 && this.health - damage <= 5) this.disadvTokens += 1;

    this.health -= damage;
  }

  // mutates
  getModifierForRoll(ability: Ability): number {
    let modifier: number = this.abilityScores[ability];
    if (this.focus > 0) {
      this.focus -= 1;
      modifier += 1;
    }
    return modifier;
  }
}
