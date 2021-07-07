import { Ability, Faction } from "../../../enum";
import Combatant from "../combatant";
import { CombatState } from "../../state";
import { Targetable } from "../targetable";
import { Actor } from "../actor";

export class Action {
  name: string;
  ability: Ability;
  targetFaction: Faction;
  evaluate: (
    checkResult: number,
    actor: Actor,
    target: Targetable,
    state: CombatState
  ) => CombatState;

  constructor(
    name: string,
    ability: Ability,
    target: Faction,
    evaluate: (
      checkResult: number,
      actor: Actor,
      target: Targetable,
      state: CombatState
    ) => CombatState
  ) {
    this.name = name;
    this.ability = ability;
    this.evaluate = evaluate;
    this.targetFaction = target;
  }

  GetValidTargets(state: CombatState, attacker: Actor): Targetable[] {
    let validTargets = state.targetsByFaction[this.targetFaction].filter(
      (target) => !target.isDead()
    );
    return validTargets;
  }
}
