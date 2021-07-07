import { Player } from "./combatants/player";
import Combatant from "./combatants/combatant";
import { Faction } from "../enum";
import { Targetable } from "./combatants/targetable";
import { Actor } from "./combatants/actor";
import { Action } from "./combatants/actions/action";

export class CombatState {
  targetsByFaction: Targetable[][]; // targets by faction and index
  actorsByFaction: Actor[][]; // actors by faction and index

  constructor(targetsByFaction: Targetable[][], actorsByFaction: Actor[][]) {
    this.targetsByFaction = targetsByFaction;
    this.actorsByFaction = actorsByFaction;
  }

  isFactionDefeated(faction: Faction): boolean {
    return this.targetsByFaction[faction]
      .filter((target) => target.isCritical())
      .every((target) => target.isDead());
  }

  getTarget(faction: Faction, index: number): Targetable {
    return this.targetsByFaction[faction][index];
  }

  getTargetFromSelf(target: Targetable): Targetable {
    return this.targetsByFaction[target.getFaction()][
      target.getIndexTargetable()
    ];
  }

  getActor(faction: Faction, index: number): Actor {
    return this.actorsByFaction[faction][index];
  }

  getActorFromSelf(actor: Actor): Actor {
    return this.actorsByFaction[actor.getFaction()][actor.getIndexActor()];
  }

  clone(): CombatState {
    let clonePlayers = this.targetsByFaction.map((targets) =>
      targets.map((target) => target.clone())
    );
    let cloneEnemies = this.actorsByFaction.map((actors) =>
      actors.map((actor) => actor.clone())
    );
    return new CombatState(clonePlayers, cloneEnemies);
  }
}
