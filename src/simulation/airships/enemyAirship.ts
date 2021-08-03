import { Faction } from "../../enum";
import { Action } from "../combatants/actions/action";
import {
  EnemyAA,
  EnemyCannons,
  EnemyTorps,
  NoAction,
} from "../combatants/actions/npcActions";
import Combatant from "../combatants/combatant";
import { CombatState } from "../state";
import { Airship, AllQuadrants, Quadrant, WeaponType } from "./airship";

export class EnemyAirship extends Airship {
  numActions: number;
  actionsTaken: number;
  indexTarget: number | null;
  partialDamage: number;
  fullDamage: number;

  constructor(
    frontQuadrant: Quadrant,
    health: number[],
    brace: number[],
    exposureTokens: number[],
    speedTokens: number[],
    advantageTokensByQuadrant: number[],
    disadvantageTokensByQuadrant: number[],
    suppressionByQuadrant: boolean[],
    numActions: number,
    actionsTaken: number,
    indexTarget: number | null,
    partialDamage: number,
    fullDamage: number
  ) {
    super(
      frontQuadrant,
      health,
      brace,
      exposureTokens,
      speedTokens,
      advantageTokensByQuadrant,
      disadvantageTokensByQuadrant,
      suppressionByQuadrant,
      Faction.Enemies
    );
    this.numActions = numActions;
    this.actionsTaken = actionsTaken;
    this.indexTarget = indexTarget;
    this.partialDamage = partialDamage;
    this.fullDamage = fullDamage;
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
      this.numActions,
      this.actionsTaken,
      this.indexTarget,
      this.partialDamage,
      this.fullDamage
    );
  }

  getBestActionAndTarget(state: CombatState): {
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
        let targets = EnemyAA.GetValidTargets(state);
        if (targets.length === 0) {
          this.indexTarget = null;
          primaryTarget = null;
        } else {
          let index = Math.round(Math.random() * (targets.length - 1));
          this.indexTarget = (targets[index] as Combatant).index;
        }
      }

      if (this.indexTarget !== null)
        return {
          action: EnemyAA,
          source: this.bestQuadrantOfSetForOffense(AllQuadrants()),
          target: state.players[this.indexTarget],
        };
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
        action: weaponType === WeaponType.Cannon ? EnemyCannons : EnemyTorps,
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
