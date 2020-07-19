import { AttackType, Ability, Faction } from "../../../enum";
import Combatant from "../combatant";
import { CombatState } from "../../state";

export class Action {
  name: string;
  minRange: number;
  maxRange: number;
  type: AttackType;
  ability: Ability;
  lowThreshold : number;
  highThreshold : number;
  target : Faction;
  evaluate: (
    checkResult: number,
    actor: Combatant,
    target: Combatant,
    state: CombatState
  ) => void;

  constructor(
    name: string,
    minRange: number,
    maxRange: number,
    type: AttackType,
    ability: Ability,
    lowThreshold : number,
    highThreshold : number,
    target : Faction,
    evaluate: (
      checkResult: number,
      actor: Combatant,
      target: Combatant,
      state: CombatState
    ) => void
  ) {
    this.name = name;
    this.minRange = minRange;
    this.maxRange = maxRange;
    this.type = type;
    this.ability = ability;
    this.evaluate = evaluate;
    this.lowThreshold = lowThreshold;
    this.highThreshold = highThreshold;
    this.target = target;
  }
}
