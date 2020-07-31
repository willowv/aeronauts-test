import { Player } from "./combatants/player";
import { CombatMap } from "./map/map";
import Combatant from "./combatants/combatant";
import { CombatantType } from "../enum";

export class CombatState {
  players: Player[];
  enemies: Combatant[];
  map: CombatMap;

  constructor(players: Player[], enemies: Combatant[], map: CombatMap) {
    this.players = players;
    this.enemies = enemies;
    this.map = map;
  }

  ArePlayersDefeated(): boolean {
    // All critical players are dead
    return this.players
      .filter((player) => player.isCritical)
      .every((player) => player.isDead());
  }

  AreEnemiesDefeated(): boolean {
    // All critical enemies are dead
    return this.enemies
      .filter((enemy) => enemy.isCritical)
      .every((enemy) => enemy.isDead());
  }

  GetCombatant(combatant: Combatant): Combatant {
    return combatant.combatantType === CombatantType.Player
      ? this.players[combatant.index]
      : this.enemies[combatant.index];
  }

  GetCombatantAsPlayer(combatant: Combatant): Player | null {
    if (!combatant.isPlayer()) {
      return null;
    }
    return this.players[combatant.index];
  }

  clone(): CombatState {
    let clonePlayers = this.players.map((player) => player.clone());
    let cloneEnemies = this.enemies.map((combatant) => combatant.clone());
    return new CombatState(clonePlayers, cloneEnemies, this.map);
  }

  ClearSuppression(): CombatState {
    let clonePlayers = this.players.map((player) => {
      let newPlayer = player.clone();
      newPlayer.isSuppressed = false;
      return newPlayer;
    });
    let cloneEnemies = this.enemies.map((combatant) => {
      let newCombatant = combatant.clone();
      newCombatant.isSuppressed = false;
      return newCombatant;
    });
    return new CombatState(clonePlayers, cloneEnemies, this.map);
  }
}
