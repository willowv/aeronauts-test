import { Ability, Boost, Faction, Token } from "../../../enum";
import { Action } from "./action";

export const Attack = new Action(
  "Attack",
  Ability.Coordination,
  Faction.Enemies,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatantFromSelf(target);
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
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatantFromSelf(target);
    if (checkResult >= 15) {
      newTarget.tokens[Token.Defense][Boost.Positive] += 3;
      newTarget.health += 2;
    } else if (checkResult >= 10) {
      newTarget.tokens[Token.Defense][Boost.Positive] += 3;
    }
    return state;
  }
);

export const WeaponOptions = [Attack, Defend];
