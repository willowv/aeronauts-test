import { CombatState } from "../../state";
import { Action } from "../actions/action";
import { Faction } from "../../../enum";
import { Actor } from "../actor";

export interface AI {
  FindBestActionAndTarget: (
    state: CombatState,
    self: Actor
  ) => { action: Action; factionTarget: Faction; indexTarget: number } | null;
}
