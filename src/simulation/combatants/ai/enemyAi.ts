import { AI } from "./ai";
import Combatant from "../combatant";
import { Action } from "../actions/action";
import { CombatState } from "../../state";

export class EnemyAI implements AI {
  primaryTarget: Combatant | null;

  constructor() {
    this.primaryTarget = null;
  }

  FindBestActionAndTarget(
    initialState: CombatState,
    self: Combatant
  ): { action: Action; target: Combatant } | null {
    // My primary target is whoever attacked me last, or choose randomly
    let action = self.actions[0] // enemies only have 1 attack at the moment
    
    if (this.primaryTarget === null || this.primaryTarget.isDead()) {
      let targets = action.GetValidTargets(initialState, self);
      let index = Math.round(Math.random() * (targets.length - 1));
      this.primaryTarget = targets[index];
    }

    return { action: action, target: this.primaryTarget };
  }
}