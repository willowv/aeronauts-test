import { AI } from "./ai";
import Combatant from "../combatant";
import { Action } from "../actions/action";
import { CombatState } from "../../state";
import { Faction } from "../../../enum";

export class EnemyAI implements AI {
  constructor() {}

  FindBestActionAndTarget(
    initialState: CombatState,
    self: Combatant
  ): { action: Action; factionTarget: Faction; indexTarget: number } | null {
    // My primary target is whoever attacked me last, or choose randomly
    let action = self.actions[0] // enemies only have 1 attack at the moment
    
    let primaryTarget = null;
    if(self.indexTarget !== null) {
      primaryTarget = initialState.players[self.indexTarget];
    }
    if (primaryTarget === null || primaryTarget.isDead()) {
      let targets = action.GetValidTargets(initialState, self);
      if(targets.length === 0)
        return null;
      
      let index = Math.round(Math.random() * (targets.length - 1));
      self.indexTarget = targets[index].index;
    }

    return { action: action, factionTarget: Faction.Players, indexTarget: self.indexTarget ?? 0 };
  }
}