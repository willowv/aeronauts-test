import { Player } from "./combatants/player";
import { GameMap } from "./map/map";
import Combatant from "./combatants/combatant";

export class GameState {
  combatantsPC: Player[];
  combatantsNPC: Combatant[];
  map: GameMap;

  constructor(
    combatantsPC: Player[],
    combatantsNPC: Combatant[],
    map: GameMap
  ) {
    this.combatantsPC = combatantsPC;
    this.combatantsNPC = combatantsNPC;
    this.map = map;
  }

  ArePlayersDefeated(): boolean {
    let defeat = true;
    this.combatantsPC.forEach((player: Combatant) => {
      if (!player.isDead() && player.isCritical) defeat = false;
    });
    return defeat;
  }

  AreEnemiesDefeated(): boolean {
    let defeat = true;
    this.combatantsNPC.forEach((enemy: Combatant) => {
      if (!enemy.isDead() && enemy.isCritical) defeat = false;
    });
    return defeat;
  }

  clone(): GameState {
    let cloneCombatantsPC = this.combatantsPC.map((player) => player.clone());
    let cloneCombatantsNPC = this.combatantsNPC.map((combatant) =>
      combatant.clone()
    );
    return new GameState(cloneCombatantsPC, cloneCombatantsNPC, this.map);
  }
}
