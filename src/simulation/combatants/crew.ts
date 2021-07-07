import { Boost, Faction } from "../../enum";
import { CombatState } from "../state";
import { Action } from "./actions/action";
import { Actor } from "./actor";
import { AI } from "./ai/ai";
import { Airship } from "./airship";
import Combatant from "./combatant";
import { Targetable } from "./targetable";

export class Crew implements Actor {
  indexActor: number;
  indexAirship: number; // index into the faction's targetables for the airship of this crew member
  indexPreferredTarget: number | null;
  faction: Faction;
  actionsPerTurn: number;
  actions: Action[];
  ai: AI;

  constructor(
    indexActor: number,
    indexAirship: number,
    indexPreferredTarget: number | null,
    faction: Faction,
    actionsPerTurn: number,
    actions: Action[],
    ai: AI
  ) {
    this.indexActor = indexActor;
    this.indexAirship = indexAirship;
    this.indexPreferredTarget = indexPreferredTarget;
    this.faction = faction;
    this.actionsPerTurn = actionsPerTurn;
    this.actions = actions;
    this.ai = ai;
  }

  clone(): Actor {
    throw new Error("Method not implemented.");
  }

  getAirship(state: CombatState): Airship {
    return state.getTarget(this.faction, this.indexAirship) as Airship;
  }

  canAct(state: CombatState): boolean {
    return !this.getAirship(state).isDead();
  }
  getActionTokens(state: CombatState, boost: Boost): number {
    let airship = this.getAirship(state);
    return airship.actionTokens[boost][airship.indexExposed];
  }
  getBoostOnAttackAndConsumeTokens(state: CombatState): number {
    let airship = this.getAirship(state);
    if (airship.health[airship.indexExposed] <= 0) return 0;

    let actionPosBoost = Math.max(
      1,
      airship.actionTokens[Boost.Positive][airship.indexExposed]
    );
    let actionNegBoost = Math.max(
      1,
      airship.actionTokens[Boost.Negative][airship.indexExposed]
    );
    airship.actionTokens[Boost.Positive][airship.indexExposed] -=
      actionPosBoost;
    airship.actionTokens[Boost.Negative][airship.indexExposed] -=
      actionNegBoost;

    return actionPosBoost - actionNegBoost;
  }
  getActions(): Action[] {
    return this.actions;
  }
  getActionsPerTurn(): number {
    return this.actionsPerTurn;
  }
  getFaction(): Faction {
    return this.faction;
  }
  getIndexActor(): number {
    return this.indexActor;
  }
  getIndexTargetable(): number {
    return this.indexAirship;
  }
  getIndexPreferredTarget(faction: Faction): number | null {
    return this.indexPreferredTarget;
  }
  setIndexPreferredTarget(faction: Faction, index: number): void {
    this.indexPreferredTarget = index;
  }

  getActionAndTarget(state: CombatState): {
    action: Action;
    targetable: Targetable;
  } {
    // Use AI module to decide
    return this.ai.FindBestActionAndTarget(state, this);
  }
}
