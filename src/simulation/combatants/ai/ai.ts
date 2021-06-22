import { CombatState } from "../../state";
import Combatant from "../combatant";
import { Action } from "../actions/action";

export interface AI {
  FindBestActionAndTarget: (
    state: CombatState,
    self: Combatant
  ) => { action: Action; target: Combatant } | null;
}
