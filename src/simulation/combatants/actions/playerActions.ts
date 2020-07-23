import { AttackType, Ability, Token, Boost, Faction } from "../../../enum";
import { Action } from "./action";

export const Pistol = new Action(
  "Pistol",
  0,
  1,
  AttackType.Ranged,
  Ability.Coordination,
  9,
  15,
  Faction.Enemies,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 15) {
      newTarget.health -= 4;
      newActor.tokens[Token.Action][Boost.Positive] += 2;
    } else if (checkResult >= 9) {
      newTarget.health -= 2;
    }
    newActor.actionsTaken++;
    return state;
  }
);

export const Shotgun = new Action(
  "Shotgun",
  0,
  1,
  AttackType.Ranged,
  Ability.Coordination,
  11,
  13,
  Faction.Enemies,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 13) {
      newTarget.health -= 3;
      // push into first zone that is further away that target, if any
      let pushableZones = state.map
        .ZonesMovableFrom(target.zone)
        .filter((zone: number) => {
          return zone !== newActor.zone;
        });
      if (pushableZones.length !== 0) newTarget.zone = pushableZones[0];
    } else if (checkResult >= 11) {
      newTarget.health -= 3;
    }
    newActor.actionsTaken++;
    return state;
  }
);

export const Rifle = new Action(
  "Rifle",
  1,
  Infinity,
  AttackType.Ranged,
  Ability.Coordination,
  12,
  17,
  Faction.Enemies,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 17) {
      newTarget.health -= 5;
      // grant an ally a move (TODO: needs decision logic, which takes in a set of potential states and returns the index of the best one)
    } else if (checkResult >= 12) {
      newTarget.health -= 4;
    }
    newActor.actionsTaken++;
    return state;
  }
);

export const LightMelee = new Action(
  "Light Melee",
  0,
  0,
  AttackType.Melee,
  Ability.Coordination,
  9,
  16,
  Faction.Enemies,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 16) {
      newTarget.health -= 6;
      newTarget.tokens[Token.Defense][Boost.Negative] += 2;
    } else if (checkResult >= 9) {
      newTarget.health -= 2;
    }
    newActor.actionsTaken++;
    return state;
  }
);

export const MediumMelee = new Action(
  "Medium Melee",
  0,
  0,
  AttackType.Melee,
  Ability.Coordination,
  10,
  16,
  Faction.Enemies,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 16) {
      newTarget.health -= 5;
      newTarget.tokens[Token.Action][Boost.Negative] += 2;
    } else if (checkResult >= 10) {
      newTarget.health -= 3;
    }
    newActor.actionsTaken++;
    return state;
  }
);

export const HeavyMelee = new Action(
  "Heavy Melee",
  0,
  0,
  AttackType.Melee,
  Ability.Coordination,
  12,
  15,
  Faction.Enemies,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 15) {
      newTarget.health -= 6;
    } else if (checkResult >= 12) {
      newTarget.health -= 4;
    }
    newActor.actionsTaken++;
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
