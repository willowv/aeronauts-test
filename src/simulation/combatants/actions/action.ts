import { AttackType, Ability, Faction } from "../../../enum";
import Combatant from "../combatant";
import { CombatState } from "../../state";
import { AI } from "../ai/ai";

export class Action {
  name: string;
  minRange: number;
  maxRange: number;
  type: AttackType;
  ability: Ability;
  targetFaction: Faction;
  evaluate: (
    checkResult: number,
    actor: Combatant,
    target: Combatant,
    state: CombatState,
    ai: AI
  ) => CombatState;

  constructor(
    name: string,
    minRange: number,
    maxRange: number,
    type: AttackType,
    ability: Ability,
    target: Faction,
    evaluate: (
      checkResult: number,
      actor: Combatant,
      target: Combatant,
      state: CombatState,
      ai: AI
    ) => CombatState
  ) {
    this.name = name;
    this.minRange = minRange;
    this.maxRange = maxRange;
    this.type = type;
    this.ability = ability;
    this.evaluate = evaluate;
    this.targetFaction = target;
  }

  GetValidTargets(state: CombatState, attacker: Combatant): Combatant[] {
    let targets =
      this.targetFaction === Faction.Players ? state.players : state.enemies;
    let validTargets = targets.filter((target) => {
      let distance = state.map.distanceBetween[attacker.zone][target.zone];
      return (
        !target.isDead() &&
        distance <= this.maxRange &&
        distance >= this.minRange
      );
    });
    return validTargets;
  }
}
