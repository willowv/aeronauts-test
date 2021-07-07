import { AI } from "./ai";
import { Action } from "../actions/action";
import { CombatState } from "../../state";
import { Faction } from "../../../enum";
import { Actor } from "../actor";

export class EnemyAI implements AI {
  FindBestActionAndTarget(
    initialState: CombatState,
    self: Actor
  ): { action: Action; factionTarget: Faction; indexTarget: number } | null {
    // My primary target is whoever attacked me last, or choose randomly
    let action = self.getActions()[0]; // enemies only have 1 attack at the moment

    let primaryTarget = null;
    let indexTarget = self.getIndexPreferredTarget(Faction.Players);
    if (indexTarget !== null) {
      primaryTarget =
        initialState.targetsByFaction[Faction.Players][indexTarget];
    }
    if (primaryTarget === null || primaryTarget.isDead()) {
      let targets = action.GetValidTargets(initialState, self);
      if (targets.length === 0) return null;

      let index = Math.round(Math.random() * (targets.length - 1));
      self.setIndexPreferredTarget(Faction.Players, index);
    }

    return {
      action: action,
      factionTarget: Faction.Players,
      indexTarget: self.getIndexPreferredTarget(Faction.Players) ?? 0,
    };
  }
}
