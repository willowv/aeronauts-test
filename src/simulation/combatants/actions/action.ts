import { Ability, Faction } from "../../../enum";
import Combatant from "../combatant";
import { CombatState } from "../../state";

export class Action {
  name: string;
  ability: Ability;
  targetFaction: Faction;
  evaluate: (
    checkResult: number,
    actor: Combatant,
    target: Combatant,
    state: CombatState
  ) => CombatState;

  constructor(
    name: string,
    ability: Ability,
    target: Faction,
    evaluate: (
      checkResult: number,
      actor: Combatant,
      target: Combatant,
      state: CombatState
    ) => CombatState
  ) {
    this.name = name;
    this.ability = ability;
    this.evaluate = evaluate;
    this.targetFaction = target;
  }

  GetValidTargets(state: CombatState, attacker: Combatant): Combatant[] {
    let targets =
      this.targetFaction === Faction.Players ? state.players : state.enemies;
    let validTargets = targets.filter((target) => !target.isDead());
    return validTargets;
  }
}
