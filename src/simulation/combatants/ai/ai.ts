import { CombatState } from "../../state";
import Combatant from "../combatant";
import { Action } from "../actions/action";
import { Faction } from "../../../enum";
import { Quadrant } from "../../airships/airship";
import { EnemyAirship } from "../../airships/enemyAirship";

export interface AI {
  FindBestActionAndTarget: (
    state: CombatState,
    self: Combatant
  ) => {
    action: Action;
    source: Combatant | Quadrant;
    target: Combatant | Quadrant;
  };
}
