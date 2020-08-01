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
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult < 10) {
      newTarget.takeDamage(3);
      newTarget.isSuppressed = true;
    } else if (checkResult < 15) {
      newTarget.takeDamage(2);
      newTarget.isSuppressed = true;
    }
    return state;
  }
);

export const EnemyAdvancedAttack = new Action(
  "Enemy Advanced Attack",
  0,
  1,
  AttackType.Ranged,
  Ability.Agility,
  10,
  15,
  Faction.Players,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult < 10) {
      newTarget.takeDamage(5);
      newTarget.isSuppressed = true;
    } else if (checkResult < 15) {
      newTarget.takeDamage(3);
      newTarget.isSuppressed = true;
    }
    return state;
  }
);