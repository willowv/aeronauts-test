import { Action } from "../combatants/actions/action";
import {
  AdvancedAA,
  AdvancedCannons,
  AdvancedTorps,
  BasicAA,
  BasicCannons,
  BasicTorps,
  NoAction,
} from "../combatants/actions/npcActions";
import Combatant from "../combatants/combatant";
import { CombatState } from "../state";
import { Airship, AllQuadrants, Quadrant, WeaponType } from "./airship";

export class EnemyAirship extends Airship {
  numBasicActions: number;
  numAdvancedActions: number;
  basicActions: Action[];
  advancedActions: Action[];
  actionsTaken: number;
  indexTarget: number | null;

  constructor(
    frontQuadrant: Quadrant,
    health: number[],
    brace: number[],
    exposureTokens: number[],
    speedTokens: number[],
    advantageTokensByQuadrant: number[],
    disadvantageTokensByQuadrant: number[],
    suppressionByQuadrant: boolean[],
    numBasicActions: number,
    numAdvancedActions: number,
    basicActions: Action[],
    advancedActions: Action[],
    actionsTaken: number,
    indexTarget: number | null
  ) {
    super(
      frontQuadrant,
      health,
      brace,
      exposureTokens,
      speedTokens,
      advantageTokensByQuadrant,
      disadvantageTokensByQuadrant,
      suppressionByQuadrant
    );
    this.numBasicActions = numBasicActions;
    this.numAdvancedActions = numAdvancedActions;
    this.basicActions = basicActions;
    this.advancedActions = advancedActions;
    this.actionsTaken = actionsTaken;
    this.indexTarget = indexTarget;
  }

  clone(): EnemyAirship {
    return new EnemyAirship(
      this.frontQuadrant,
      [...this.healthByQuadrant],
      [...this.braceByQuadrant],
      [...this.exposureTokensByQuadrant],
      [...this.speedTokens],
      [...this.advantageTokensByQuadrant],
      [...this.disadvantageTokensByQuadrant],
      [...this.suppressionByQuadrant],
      this.numBasicActions,
      this.numAdvancedActions,
      this.basicActions,
      this.advancedActions,
      this.actionsTaken,
      this.indexTarget
    );
  }

  getBestBasicActionAndTarget(state: CombatState): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    return this.getBestActionAndTarget(
      state,
      BasicCannons,
      BasicTorps,
      BasicAA
    );
  }

  getBestAdvancedActionAndTarget(state: CombatState): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    return this.getBestActionAndTarget(
      state,
      AdvancedCannons,
      AdvancedTorps,
      AdvancedAA
    );
  }

  getBestActionAndTarget(
    state: CombatState,
    cannons: Action,
    torpedoes: Action,
    aa: Action
  ): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    // If there's no airship or the airship is dead, we cannot act
    if (this.isDead())
      return {
        action: NoAction,
        source: Quadrant.A,
        target: Quadrant.A,
      };

    // If there's no enemy airship or the airship is dead, target an enemy fighter
    if (state.playerAirship === null || state.playerAirship.isDead()) {
      let primaryTarget = null;
      if (this.indexTarget !== null)
        primaryTarget = state.players[this.indexTarget];

      if (primaryTarget === null || primaryTarget.isDead()) {
        let targets = aa.GetValidTargets(state);
        if (targets.length === 0) {
          this.indexTarget = null;
          primaryTarget = null;
        } else {
          let index = Math.round(Math.random() * (targets.length - 1));
          this.indexTarget = (targets[index] as Combatant).index;
          return {
            action: aa,
            source: this.bestQuadrantOfSetForOffense(AllQuadrants()),
            target: state.players[this.indexTarget],
          };
        }
      }
    }

    if (state.playerAirship !== null && !state.playerAirship.isDead()) {
      let attackQuadrant = this.bestAttackingQuadrant(state.playerAirship);
      if (attackQuadrant === null)
        return {
          action: NoAction,
          source: Quadrant.A,
          target: Quadrant.A,
        };

      let weaponType =
        attackQuadrant === Quadrant.A ? WeaponType.Cannon : WeaponType.Torpedo;
      return {
        action: weaponType === WeaponType.Cannon ? cannons : torpedoes,
        source: attackQuadrant,
        target: this.bestTargetQuadrantForAttackFrom(
          attackQuadrant,
          state.playerAirship
        ),
      };
    }

    return {
      action: NoAction,
      source: Quadrant.A,
      target: Quadrant.A,
    };
  }
}
