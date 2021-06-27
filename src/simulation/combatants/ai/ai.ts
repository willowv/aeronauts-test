import { CombatState } from "../../state";
import Combatant from "../combatant";
import { Action } from "../actions/action";
import { Faction } from "../../../enum";

export interface AI {
  FindBestActionAndTarget: (
    state: CombatState,
    self: Combatant
  ) => { action: Action; factionTarget: Faction; indexTarget: number } | null;
}
