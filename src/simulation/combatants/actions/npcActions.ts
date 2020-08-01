import { AttackType, Ability, Faction, Token, Boost } from "../../../enum";
import { Action } from "./action";

export const EnemyBasicRangedAttack = new Action(
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

export const EnemyBasicMeleeAttack = new Action(
  "Enemy Basic Attack",
  0,
  0,
  AttackType.Melee,
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
      newTarget.takeDamage(1);
      newTarget.tokens[Token.Defense][Boost.Negative]++;
      newTarget.isSuppressed = true;
    }
    return state;
  }
);

export const EnemyAdvancedRangedAttack = new Action(
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

export const EnemyAdvancedMeleeAttack = new Action(
  "Enemy Advanced Attack",
  0,
  0,
  AttackType.Melee,
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

export const EnemyAdvancedCroakRoar = new Action(
  "Croak/Roar",
  0,
  1,
  AttackType.Special,
  Ability.Conviction,
  10,
  15,
  Faction.Players,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult < 10) {
      newTarget.takeDamage(3);
      newTarget.tokens[Token.Action][Boost.Negative]++;
      newTarget.tokens[Token.Defense][Boost.Negative]++;
      newTarget.isSuppressed = true;
    } else if (checkResult < 15) {
      newTarget.takeDamage(2);
      newTarget.tokens[Token.Action][Boost.Negative]++;
      newTarget.isSuppressed = true;
    }
    return state;
  }
);