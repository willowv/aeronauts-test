import { Ability, Faction } from "../../../enum";
import { Action } from "./action";

export const EnemyBasicAttack = new Action(
  "Enemy Basic Attack",
  Ability.Agility,
  Faction.Players,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult < 10) {
      newTarget.takeDamage(3);
    } else if (checkResult < 15) {
      newTarget.takeDamage(2);
    }
    return state;
  }
);

export const EnemyAdvancedAttack = new Action(
  "Enemy Advanced Attack",
  Ability.Agility,
  Faction.Players,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult < 10) {
      newTarget.takeDamage(5);
    } else if (checkResult < 15) {
      newTarget.takeDamage(2);
    }
    return state;
  }
);
