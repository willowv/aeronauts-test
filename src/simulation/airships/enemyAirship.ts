import { Action } from "../combatants/actions/action";
import Combatant from "../combatants/combatant";
import { CombatState } from "../state";
import { Airship, Quadrant } from "./airship";

export class EnemyAirship extends Airship {
  numBasicActions: number;
  numAdvancedActions: number;
  basicActions: Action[];
  advancedActions: Action[];

  constructor(
    frontQuadrant: Quadrant,
    health: number[],
    brace: number[],
    exposureTokens: number[],
    speedTokens: number[],
    advantageTokensByQuadrant: number[],
    disadvantageTokensByQuadrant: number[],
    numBasicActions: number,
    numAdvancedActions: number,
    basicActions: Action[],
    advancedActions: Action[]
  ) {
    super(
      frontQuadrant,
      health,
      brace,
      exposureTokens,
      speedTokens,
      advantageTokensByQuadrant,
      disadvantageTokensByQuadrant
    );
    this.numBasicActions = numBasicActions;
    this.numAdvancedActions = numAdvancedActions;
    this.basicActions = basicActions;
    this.advancedActions = advancedActions;
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
      this.numBasicActions,
      this.numAdvancedActions,
      this.basicActions,
      this.advancedActions
    );
  }

  getBestBasicActionAndTarget(state: CombatState): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    // Attack with cannons, torpedoes, or anti-air?
    let action = this.basicActions[0];
    let targets = action.GetValidTargets(state);
    return { action: action, source: this.frontQuadrant, target: targets[0] }; // TODO: use correct quadrant
  }

  getBestAdvancedActionAndTarget(state: CombatState): {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  } {
    let action = this.advancedActions[0];
    let targets = action.GetValidTargets(state);
    return { action: action, source: this.frontQuadrant, target: targets[0] }; // TODO: use correct quadrant
  }
}
