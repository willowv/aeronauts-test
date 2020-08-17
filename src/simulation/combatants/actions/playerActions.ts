import { AttackType, Ability, Token, Boost, Faction } from "../../../enum";
import { Action } from "./action";

export const Pistol = new Action(
  "Pistol",
  0,
  1,
  AttackType.Ranged,
  Ability.Coordination,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 16) {
      newTarget.takeDamage(4);
      newTarget.tokens[Token.Action][Boost.Negative] += 1;
      let alliesInZone = state.GetCombatantsOfFactionInZone(
        newActor.faction,
        newTarget.zone
      );
      if (alliesInZone.length !== 0)
        alliesInZone[0].tokens[Token.Defense][Boost.Positive] += 1;

      newTarget.isSuppressed = true;
    } else if (checkResult >= 9) {
      newTarget.takeDamage(2);
      newTarget.tokens[Token.Action][Boost.Negative] += 1;
      newTarget.isSuppressed = true;
    }
    return state;
  }
);

export const Shotgun = new Action(
  "Shotgun",
  0,
  1,
  AttackType.Ranged,
  Ability.Coordination,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 16) {
      newTarget.takeDamage(6);
      newTarget.tokens[Token.Defense][Boost.Negative] += 1;
      newTarget.isSuppressed = true;
    } else if (checkResult >= 10) {
      newTarget.takeDamage(3);
      newTarget.isSuppressed = true;
    }
    return state;
  }
);

export const Rifle = new Action(
  "Rifle",
  1,
  Infinity,
  AttackType.Ranged,
  Ability.Coordination,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 15) {
      newTarget.takeDamage(4);
      newTarget.tokens[Token.Defense][Boost.Negative] += 1;
      let alliesInZone = state.GetCombatantsOfFactionInZone(
        newActor.faction,
        newTarget.zone
      );
      if (alliesInZone.length !== 0)
        alliesInZone[0].tokens[Token.Action][Boost.Positive] += 1;

      newTarget.isSuppressed = true;
    } else if (checkResult >= 11) {
      newTarget.takeDamage(2);
      newTarget.tokens[Token.Defense][Boost.Negative] += 1;
      newTarget.isSuppressed = true;
    }
    return state;
  }
);

export const LightMelee = new Action(
  "Light Melee",
  0,
  0,
  AttackType.Melee,
  Ability.Coordination,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 16) {
      newTarget.takeDamage(4);
      newTarget.tokens[Token.Defense][Boost.Negative] += 2;
      newTarget.isSuppressed = true;
    } else if (checkResult >= 9) {
      newTarget.takeDamage(2);
      newTarget.tokens[Token.Defense][Boost.Negative] += 1;
      newTarget.isSuppressed = true;
    }
    return state;
  }
);

export const MediumMelee = new Action(
  "Medium Melee",
  0,
  0,
  AttackType.Melee,
  Ability.Coordination,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 15) {
      newTarget.takeDamage(4);
      newTarget.tokens[Token.Action][Boost.Negative] += 1;
      newTarget.isSuppressed = true;
    } else if (checkResult >= 10) {
      newTarget.takeDamage(2);
      newTarget.tokens[Token.Action][Boost.Negative] += 1;
      newTarget.isSuppressed = true;
    }
    return state;
  }
);

export const HeavyMelee = new Action(
  "Heavy Melee",
  0,
  0,
  AttackType.Melee,
  Ability.Coordination,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 13) {
      newTarget.takeDamage(5);
      newTarget.isSuppressed = true;
    } else if (checkResult >= 11) {
      newTarget.takeDamage(3);
      newTarget.isSuppressed = true;
    }
    return state;
  }
);

export const WeaponOptions = [
  Pistol,
  Shotgun,
  Rifle,
  LightMelee,
  MediumMelee,
  HeavyMelee,
];
