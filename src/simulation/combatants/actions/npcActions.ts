import { AttackType, Ability, Faction } from "../../../enum";
import { Action } from "./action";

export const EnemyBasicAttack = new Action(
  "Enemy Basic Attack",
  0,
  1,
  AttackType.Ranged,
  Ability.Agility,
  10,
  15,
  Faction.Players,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult < 10) {
      newTarget.health -= 5;
      newTarget.isSuppressed = true;
    } else if (checkResult < 15) {
      newTarget.health -= 2;
      newTarget.isSuppressed = true;
    }
    return state;
  }
);
