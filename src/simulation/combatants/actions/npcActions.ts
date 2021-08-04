import { Ability, CombatantType, Faction } from "../../../enum";
import { Quadrant, WeaponType } from "../../airships/airship";
import Combatant from "../combatant";
import { Action, ActionType, SourceType } from "./action";

export const EnemyAttack = new Action(
  "Enemy Attack",
  Ability.Agility,
  Faction.Enemies,
  Faction.Players,
  CombatantType.Ground,
  ActionType.Contested,
  WeaponType.Ground,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatantFromSelf(target as Combatant);
    let newActor = state.GetCombatantFromSelf(actor as Combatant);
    if (checkResult < 10) {
      newTarget.takeDamage(newActor.fullDamage);
    } else if (checkResult < 15) {
      newTarget.takeDamage(newActor.partialDamage);
    }
    return state;
  }
);

export const EnemyCannons = new Action(
  "Enemy Cannons",
  Ability.Perception,
  Faction.Enemies,
  Faction.Players,
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
    if (checkResult < 10) {
      state.playerAirship.takeDamage(
        targetQuadrant,
        state.enemyAirship.fullDamage
      );
    } else if (checkResult < 15) {
      state.playerAirship.takeDamage(
        targetQuadrant,
        state.enemyAirship.partialDamage
      );
    }
    state.playerAirship.suppressionByQuadrant[targetQuadrant] = true;
    return state;
  }
);

export const EnemyTorps = new Action(
  "Enemy Torpedoes",
  Ability.Perception,
  Faction.Enemies,
  Faction.Players,
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
    if (checkResult < 10) {
      state.playerAirship.takeDamage(
        targetQuadrant,
        state.enemyAirship.fullDamage - 1
      );
      state.playerAirship.exposureTokensByQuadrant[targetQuadrant] += 1;
    } else if (checkResult < 15) {
      state.playerAirship.takeDamage(
        targetQuadrant,
        state.enemyAirship.partialDamage
      );
    }
    state.playerAirship.suppressionByQuadrant[targetQuadrant] = true;
    return state;
  }
);

export const EnemyAA = new Action(
  "Enemy Anti-Air",
  Ability.Perception,
  Faction.Enemies,
  Faction.Players,
  CombatantType.Fighter,
  ActionType.Contested,
  WeaponType.AA,
  SourceType.Quadrant,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    if (
      !state.isAirCombat ||
      state.enemyAirship === null ||
      state.enemyAirship.isDead()
    )
      return state;

    let newTarget = state.GetCombatantFromSelf(target as Combatant);
    if (checkResult < 10) {
      newTarget.takeDamage(state.enemyAirship.fullDamage - 1);
      newTarget.disadvTokens += 1;
    } else if (checkResult < 15) {
      newTarget.takeDamage(state.enemyAirship.partialDamage);
    }
    return state;
  }
);

export const EnemyFighterGuns = new Action(
  "Enemy Fighter Guns",
  Ability.Perception,
  Faction.Enemies,
  Faction.Players,
  CombatantType.Fighter,
  ActionType.Contested,
  WeaponType.FighterGuns,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    if (!state.isAirCombat) return state;

    let newTarget = state.GetCombatantFromSelf(target as Combatant);
    let newActor = state.GetCombatantFromSelf(actor as Combatant);
    if (checkResult < 10) {
      newTarget.takeDamage(newActor.fullDamage - 1);
      newTarget.disadvTokens += 1;
    } else if (checkResult < 15) {
      newTarget.takeDamage(newActor.partialDamage);
    }
    return state;
  }
);

export const EnemyBombs = new Action(
  "Enemy Bombs",
  Ability.Perception,
  Faction.Enemies,
  Faction.Players,
  CombatantType.Airship,
  ActionType.Contested,
  WeaponType.Bomb,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    if (
      !state.isAirCombat ||
      state.playerAirship === null ||
      state.playerAirship.isDead()
    )
      return state;

    let targetQuadrant = target as Quadrant;
    let newActor = state.GetCombatantFromSelf(actor as Combatant);
    if (!state.playerAirship.suppressionByQuadrant[targetQuadrant]) {
      let targetAdvantage = Math.min(
        1,
        state.playerAirship.advantageTokensByQuadrant[targetQuadrant]
      );
      let targetDisadvantage = Math.min(
        1,
        state.playerAirship.disadvantageTokensByQuadrant[targetQuadrant]
      );
      state.playerAirship.advantageTokensByQuadrant[targetQuadrant] -=
        targetAdvantage;
      state.playerAirship.disadvantageTokensByQuadrant[targetQuadrant] -=
        targetDisadvantage;
      let freeAttackDamage = 3 + targetAdvantage - targetDisadvantage;
      newActor.takeDamage(freeAttackDamage);
      if (newActor.isDead()) return state;
    }

    if (checkResult < 10) {
      state.playerAirship.takeDamage(targetQuadrant, newActor.fullDamage);
    } else if (checkResult < 15) {
      state.playerAirship.takeDamage(targetQuadrant, newActor.partialDamage);
    }
    state.playerAirship.suppressionByQuadrant[targetQuadrant] = true;
    return state;
  }
);

export const NoAction = new Action(
  "No Action",
  null,
  Faction.Enemies,
  Faction.Players,
  CombatantType.Ground,
  ActionType.Uncontested,
  WeaponType.None,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    return initialState;
  }
);
