import { Ability, Boost, CombatantType, Faction, Token } from "../../../enum";
import { Airship, Quadrant, WeaponType } from "../../airships/airship";
import Combatant from "../combatant";
import { Action, ActionType, SourceType } from "./action";

export const Attack = new Action(
  "Attack",
  Ability.Coordination,
  Faction.Players,
  Faction.Enemies,
  CombatantType.Ground,
  ActionType.Contested,
  WeaponType.Ground,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatantFromSelf(target as Combatant);
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
  Faction.Players,
  CombatantType.Ground,
  ActionType.Contested,
  WeaponType.None,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatantFromSelf(target as Combatant);
    if (checkResult >= 15) {
      newTarget.tokens[Token.Defense][Boost.Positive] += 3;
      newTarget.health += 2;
    } else if (checkResult >= 10) {
      newTarget.tokens[Token.Defense][Boost.Positive] += 3;
    }
    return state;
  }
);

export const Cannons = new Action(
  "Player Cannons",
  Ability.Conviction,
  Faction.Players,
  Faction.Enemies,
  CombatantType.Airship,
  ActionType.Contested,
  WeaponType.Cannon,
  SourceType.Quadrant,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    if (
      !state.isAirCombat ||
      state.enemyAirship === null ||
      state.enemyAirship.isDead() ||
      state.playerAirship === null ||
      state.playerAirship.isDead()
    )
      return state;

    let targetQuadrant = target as Quadrant;
    if (checkResult >= 15) {
      state.enemyAirship.takeDamage(targetQuadrant, 5);
    } else if (checkResult >= 10) {
      state.enemyAirship.takeDamage(targetQuadrant, 3);
    }
    return state;
  }
);

export const Torpedoes = new Action(
  "Player Torpedoes",
  Ability.Conviction,
  Faction.Players,
  Faction.Enemies,
  CombatantType.Airship,
  ActionType.Contested,
  WeaponType.Torpedo,
  SourceType.Quadrant,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    if (
      !state.isAirCombat ||
      state.enemyAirship === null ||
      state.enemyAirship.isDead() ||
      state.playerAirship === null ||
      state.playerAirship.isDead()
    )
      return state;

    let targetQuadrant = target as Quadrant;
    if (checkResult >= 15) {
      state.enemyAirship.takeDamage(targetQuadrant, 4);
      state.enemyAirship.exposureTokensByQuadrant[targetQuadrant] += 1;
    } else if (checkResult >= 10) {
      state.enemyAirship.takeDamage(targetQuadrant, 2);
      state.enemyAirship.disadvantageTokensByQuadrant[targetQuadrant] += 1;
    }
    return state;
  }
);

export const AntiAir = new Action(
  "Player Anti-Air",
  Ability.Conviction,
  Faction.Players,
  Faction.Enemies,
  CombatantType.Fighter,
  ActionType.Contested,
  WeaponType.AA,
  SourceType.Quadrant,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    if (
      !state.isAirCombat ||
      state.enemyAirship === null ||
      state.enemyAirship.isDead() ||
      state.playerAirship === null ||
      state.playerAirship.isDead()
    )
      return state;

    let newTarget = state.GetCombatantFromSelf(target as Combatant);
    if (checkResult < 10) {
      newTarget.takeDamage(4);
      newTarget.tokens[Token.Action][Boost.Negative] += 1;
    } else if (checkResult < 15) {
      newTarget.takeDamage(2);
      newTarget.tokens[Token.Action][Boost.Negative] += 1;
    }
    return state;
  }
);

export const AugmentSystems = new Action(
  "Player Augment",
  Ability.Intelligence,
  Faction.Players,
  Faction.Players,
  CombatantType.Airship,
  ActionType.Benevolent,
  WeaponType.None,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    if (
      !state.isAirCombat ||
      state.enemyAirship === null ||
      state.enemyAirship.isDead() ||
      state.playerAirship === null ||
      state.playerAirship.isDead()
    )
      return state;

    if (checkResult >= 15) {
      FindBuff(state.playerAirship);
      FindBuff(state.playerAirship);
    } else if (checkResult >= 10) {
      FindBuff(state.playerAirship);
    }
    return state;
  }
);

function FindBuff(airship: Airship): void {
  let frontQuadrants = airship.frontThreeQuadrants();
  let offenseQuadrant = airship.bestQuadrantOfSetForDefense(frontQuadrants);
  let defenseQuadrant = airship.worstQuadrantOfSetForDefense(frontQuadrants);
  if (airship.advantageTokensByQuadrant[offenseQuadrant] === 0) {
    airship.advantageTokensByQuadrant[offenseQuadrant] += 3;
    return;
  }
  if (airship.speedTokens[Boost.Positive] <= 3) {
    airship.speedTokens[Boost.Positive] += 3;
    return;
  } else {
    airship.braceByQuadrant[defenseQuadrant] += 4;
  }
}

export const FighterGuns = new Action(
  "Player Fighter Guns",
  Ability.Coordination,
  Faction.Players,
  Faction.Enemies,
  CombatantType.Fighter,
  ActionType.Contested,
  WeaponType.FighterGuns,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    if (
      !state.isAirCombat ||
      state.enemyAirship === null ||
      state.enemyAirship.isDead() ||
      state.playerAirship === null ||
      state.playerAirship.isDead()
    )
      return state;

    let newTarget = state.GetCombatantFromSelf(target as Combatant);
    if (checkResult < 10) {
      newTarget.takeDamage(5);
    } else if (checkResult < 15) {
      newTarget.takeDamage(3);
    }
    return state;
  }
);

export const Bombs = new Action(
  "Player Bombs",
  Ability.Coordination,
  Faction.Players,
  Faction.Enemies,
  CombatantType.Airship,
  ActionType.Contested,
  WeaponType.Bomb,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    if (
      !state.isAirCombat ||
      state.enemyAirship === null ||
      state.enemyAirship.isDead() ||
      state.playerAirship === null ||
      state.playerAirship.isDead()
    )
      return state;

    let targetQuadrant = target as Quadrant;
    let targetAdvantage = Math.max(
      1,
      state.enemyAirship.advantageTokensByQuadrant[targetQuadrant]
    );
    let targetDisadvantage = Math.max(
      1,
      state.enemyAirship.disadvantageTokensByQuadrant[targetQuadrant]
    );
    state.enemyAirship.advantageTokensByQuadrant[targetQuadrant] -=
      targetAdvantage;
    state.enemyAirship.disadvantageTokensByQuadrant[targetQuadrant] -=
      targetDisadvantage;
    let freeAttackDamage = 2 + targetAdvantage - targetDisadvantage;
    let newActor = state.GetCombatantFromSelf(actor as Combatant);
    newActor.takeDamage(freeAttackDamage);
    if (newActor.isDead()) return state;

    if (checkResult >= 15) {
      state.enemyAirship.takeDamage(targetQuadrant, 5);
    } else if (checkResult >= 10) {
      state.enemyAirship.takeDamage(targetQuadrant, 3);
    }
    return state;
  }
);
