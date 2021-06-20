import { Player } from "./combatants/player";
import Combatant from "./combatants/combatant";

export class CombatState {
  players: Player[];
  enemies: Combatant[];

  constructor(players: Player[], enemies: Combatant[]) {
    this.players = players;
    this.enemies = enemies;
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
    return combatant.isPlayer()
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
    return new CombatState(clonePlayers, cloneEnemies);
  }
}
