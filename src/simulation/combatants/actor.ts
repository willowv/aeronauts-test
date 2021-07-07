import { Boost, Faction } from "../../enum";
import { CombatState } from "../state";
import { Action } from "./actions/action";
import { Targetable } from "./targetable";

export interface Actor {
  canAct(state: CombatState): boolean;
  getActionTokens(state: CombatState, boost: Boost): number;
  getBoostOnAttackAndConsumeTokens(state: CombatState): number;
  getActions(): Action[];
  getActionsPerTurn(): number;
  getFaction(): Faction;
  getIndexActor(): number;
  getIndexTargetable(): number;
  getActionAndTarget(state: CombatState): {
    action: Action;
    targetable: Targetable;
  };
  getIndexPreferredTarget(faction: Faction): number | null;
  setIndexPreferredTarget(faction: Faction, index: number): void;
  clone(): Actor;
}
