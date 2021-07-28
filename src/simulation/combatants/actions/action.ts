import { Ability, CombatantType, Faction } from "../../../enum";
import Combatant from "../combatant";
import { CombatState } from "../../state";
import { Airship, Quadrant, WeaponType } from "../../airships/airship";

export enum ActionType {
  Contested = 0,
  Uncontested,
  Benevolent,
}

export enum SourceType {
  Personal = 0,
  Quadrant,
}

export class Action {
  name: string;
  ability: Ability | null;
  actorFaction: Faction;
  targetFaction: Faction;
  targetType: CombatantType;
  type: ActionType;
  weaponType: WeaponType;
  sourceType: SourceType;
  evaluate: (
    checkResult: number,
    actor: Combatant | Quadrant,
    target: Combatant | Quadrant,
    state: CombatState
  ) => CombatState;

  constructor(
    name: string,
    ability: Ability | null,
    actorFaction: Faction,
    targetFaction: Faction,
    targetType: CombatantType,
    type: ActionType,
    weaponType: WeaponType,
    sourceType: SourceType,
    evaluate: (
      checkResult: number,
      actor: Combatant | Quadrant,
      target: Combatant | Quadrant,
      state: CombatState
    ) => CombatState
  ) {
    this.name = name;
    this.ability = ability;
    this.actorFaction = actorFaction;
    this.evaluate = evaluate;
    this.targetFaction = targetFaction;
    this.targetType = targetType;
    this.type = type;
    this.weaponType = weaponType;
    this.sourceType = sourceType;
  }

  GetValidTargets(state: CombatState): Combatant[] | Quadrant[] {
    if (this.targetType === CombatantType.Airship) {
      if (!state.isAirCombat) return [];
      let airship: Airship | null = null;
      if (this.targetFaction === Faction.Players) airship = state.playerAirship;
      if (this.targetFaction === Faction.Enemies) airship = state.enemyAirship;

      if (airship === null) return [];

      return airship.targetableQuadrants(this.weaponType);
    }
    let targets =
      this.targetFaction === Faction.Players ? state.players : state.enemies;
    let validTargets = targets.filter(
      (target) => !target.isDead() && target.type === this.targetType
    );
    return validTargets;
  }
}
