import { Ability, Boost, CombatantType, Faction, Token } from "../../../enum";
import { Quadrant, WeaponType } from "../../airships/airship";
import { CombatState } from "../../state";
import Combatant from "../combatant";
import { Action, ActionType, SourceType } from "./action";

export const EnemyBasicAttack = new Action(
  "Enemy Basic Attack",
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
  Faction.Enemies,
  Faction.Players,
  CombatantType.Ground,
  ActionType.Contested,
  WeaponType.Ground,
  SourceType.Personal,
  (checkResult, actor, target, initialState) => {
    let state = initialState.clone();
    let newTarget = state.GetCombatantFromSelf(target as Combatant);
    if (checkResult < 10) {
      newTarget.takeDamage(5);
    } else if (checkResult < 15) {
      newTarget.takeDamage(2);
    }
    return state;
  }
);

export const BasicCannons = new Action(
  "Enemy Basic Cannons",
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
      state.playerAirship.takeDamage(targetQuadrant, 3);
    } else if (checkResult < 15) {
      state.playerAirship.takeDamage(targetQuadrant, 2);
    }
    return state;
  }
);

export const BasicTorps = new Action(
  "Enemy Basic Torpedoes",
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
      state.playerAirship.takeDamage(targetQuadrant, 2);
      state.playerAirship.exposureTokensByQuadrant[targetQuadrant] += 1;
    } else if (checkResult < 15) {
      state.playerAirship.takeDamage(targetQuadrant, 1);
      state.playerAirship.exposureTokensByQuadrant[targetQuadrant] += 1;
    }
    return state;
  }
);

const BasicAAorFighterGunsEval = (
  checkResult: number,
  actor: Combatant | Quadrant,
  target: Combatant | Quadrant,
  initialState: CombatState
) => {
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
    newTarget.takeDamage(2);
    newTarget.tokens[Token.Action][Boost.Negative] += 1;
  } else if (checkResult < 15) {
    newTarget.takeDamage(1);
    newTarget.tokens[Token.Action][Boost.Negative] += 1;
  }
  return state;
};

export const BasicAA = new Action(
  "Enemy Basic Anti-Air",
  Ability.Perception,
  Faction.Enemies,
  Faction.Players,
  CombatantType.Fighter,
  ActionType.Contested,
  WeaponType.AA,
  SourceType.Quadrant,
  BasicAAorFighterGunsEval
);

export const BasicFighterGuns = new Action(
  "Enemy Basic Fighter Guns",
  Ability.Perception,
  Faction.Enemies,
  Faction.Players,
  CombatantType.Fighter,
  ActionType.Contested,
  WeaponType.FighterGuns,
  SourceType.Personal,
  BasicAAorFighterGunsEval
);

export const AdvancedCannons = new Action(
  "Enemy Advanced Cannons",
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
      state.playerAirship.takeDamage(targetQuadrant, 5);
    } else if (checkResult < 15) {
      state.playerAirship.takeDamage(targetQuadrant, 2);
    }
    return state;
  }
);

export const AdvancedTorps = new Action(
  "Enemy Advanced Torpedoes",
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
      state.playerAirship.takeDamage(targetQuadrant, 4);
      state.playerAirship.exposureTokensByQuadrant[targetQuadrant] += 1;
    } else if (checkResult < 15) {
      state.playerAirship.takeDamage(targetQuadrant, 2);
    }
    return state;
  }
);

const AdvancedAAorFighterGunsEval = (
  checkResult: number,
  actor: Combatant | Quadrant,
  target: Combatant | Quadrant,
  initialState: CombatState
) => {
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
  }
  return state;
};

export const AdvancedAA = new Action(
  "Enemy Advanced Anti-Air",
  Ability.Perception,
  Faction.Enemies,
  Faction.Players,
  CombatantType.Fighter,
  ActionType.Contested,
  WeaponType.AA,
  SourceType.Quadrant,
  AdvancedAAorFighterGunsEval
);

export const AdvancedFighterGuns = new Action(
  "Enemy Advanced Fighter Guns",
  Ability.Perception,
  Faction.Enemies,
  Faction.Players,
  CombatantType.Fighter,
  ActionType.Contested,
  WeaponType.FighterGuns,
  SourceType.Personal,
  AdvancedAAorFighterGunsEval
);

export const BasicBombs = new Action(
  "Enemy Basic Bombs",
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
      state.enemyAirship === null ||
      state.enemyAirship.isDead() ||
      state.playerAirship === null ||
      state.playerAirship.isDead()
    )
      return state;

    let targetQuadrant = target as Quadrant;
    let targetAdvantage = Math.max(
      1,
      state.playerAirship.advantageTokensByQuadrant[targetQuadrant]
    );
    let targetDisadvantage = Math.max(
      1,
      state.playerAirship.disadvantageTokensByQuadrant[targetQuadrant]
    );
    state.playerAirship.advantageTokensByQuadrant[targetQuadrant] -=
      targetAdvantage;
    state.playerAirship.disadvantageTokensByQuadrant[targetQuadrant] -=
      targetDisadvantage;
    let freeAttackDamage = 2 + targetAdvantage - targetDisadvantage;
    let newActor = state.GetCombatantFromSelf(actor as Combatant);
    newActor.takeDamage(freeAttackDamage);

    if (checkResult >= 15) {
      state.playerAirship.takeDamage(targetQuadrant, 3);
    } else if (checkResult >= 10) {
      state.playerAirship.takeDamage(targetQuadrant, 2);
    }
    return state;
  }
);

export const AdvancedBombs = new Action(
  "Enemy Advanced Bombs",
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
      state.enemyAirship === null ||
      state.enemyAirship.isDead() ||
      state.playerAirship === null ||
      state.playerAirship.isDead()
    )
      return state;

    let targetQuadrant = target as Quadrant;
    let targetAdvantage = Math.max(
      1,
      state.playerAirship.advantageTokensByQuadrant[targetQuadrant]
    );
    let targetDisadvantage = Math.max(
      1,
      state.playerAirship.disadvantageTokensByQuadrant[targetQuadrant]
    );
    state.playerAirship.advantageTokensByQuadrant[targetQuadrant] -=
      targetAdvantage;
    state.playerAirship.disadvantageTokensByQuadrant[targetQuadrant] -=
      targetDisadvantage;
    let freeAttackDamage = 2 + targetAdvantage - targetDisadvantage;
    let newActor = state.GetCombatantFromSelf(actor as Combatant);
    newActor.takeDamage(freeAttackDamage);

    if (checkResult >= 15) {
      state.playerAirship.takeDamage(targetQuadrant, 5);
    } else if (checkResult >= 10) {
      state.playerAirship.takeDamage(targetQuadrant, 2);
    }
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
