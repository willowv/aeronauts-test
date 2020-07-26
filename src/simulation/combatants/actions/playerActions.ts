import { AttackType, Ability, Token, Boost, Faction } from "../../../enum";
import { Action } from "./action";
import { Move } from "../../simulator";
import { RollDice } from "../../dice";

export const Pistol = new Action(
  "Pistol",
  0,
  1,
  AttackType.Ranged,
  Ability.Coordination,
  9,
  15,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 15) {
      newTarget.health -= 4;
      newActor.tokens[Token.Action][Boost.Positive] += 2;
      newTarget.isSuppressed = true;
    } else if (checkResult >= 9) {
      newTarget.health -= 2;
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
  11,
  13,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
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
      let pushZone = ai.FindBestMoveAmong(state, newTarget, pushableZones);
      if (pushZone !== null) newTarget.zone = pushZone;

      newTarget.isSuppressed = true;
    } else if (checkResult >= 11) {
      newTarget.health -= 3;
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
  12,
  17,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newActor = state.GetCombatant(actor);
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 17) {
      newTarget.health -= 5;
      newTarget.isSuppressed = true;
      let bestAllyMove = ai.FindBestAllyMove(state, newActor);
      if (bestAllyMove !== null) {
        let ally = bestAllyMove.ally;
        let zoneDest = bestAllyMove.zoneDest;
        state = Move(state, ally, zoneDest, RollDice, ai);
      }
    } else if (checkResult >= 12) {
      newTarget.health -= 4;
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
  9,
  16,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 16) {
      newTarget.health -= 6;
      newTarget.tokens[Token.Defense][Boost.Negative] += 2;
      newTarget.isSuppressed = true;
    } else if (checkResult >= 9) {
      newTarget.health -= 2;
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
  10,
  16,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 16) {
      newTarget.health -= 5;
      newTarget.tokens[Token.Action][Boost.Negative] += 2;
      newTarget.isSuppressed = true;
    } else if (checkResult >= 10) {
      newTarget.health -= 3;
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
  12,
  15,
  Faction.Enemies,
  (checkResult, actor, target, initialState, ai) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatant(target);
    if (checkResult >= 15) {
      newTarget.health -= 6;
      newTarget.isSuppressed = true;
    } else if (checkResult >= 12) {
      newTarget.health -= 4;
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
