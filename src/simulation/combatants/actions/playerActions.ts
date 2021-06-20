import { Ability, Token, Boost, Faction } from "../../../enum";
import { Action } from "./action";

export const Attack = new Action(
  "Attack",
  Ability.Coordination,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 15) {
      newTarget.takeDamage(5);
    } else if (checkResult >= 10) {
      newTarget.takeDamage(3);
    }
    return state;
  }
);

export const Defend = new Action(
  "Defend",
  Ability.Perception,
  Faction.Players,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 15) {
      newTarget.health += 5;
    } else if (checkResult >= 10) {
      newTarget.health += 3;
    }
    return state;
  }
);

export const WeaponOptions = [
  Attack,
  Defend
];
