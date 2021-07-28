import { Player } from "./combatants/player";
import Combatant from "./combatants/combatant";
import { Faction } from "../enum";
import { Airship } from "./airships/airship";
import { PlayerAirship } from "./airships/playerAirship";

export class CombatState {
  players: Player[];
  playerAirship: PlayerAirship | null;
  enemies: Combatant[];
  enemyAirship: Airship | null;
  isAirCombat: boolean;

  constructor(
    players: Player[],
    playerAirship: PlayerAirship | null,
    enemies: Combatant[],
    enemyAirship: Airship | null,
    isAirCombat: boolean
  ) {
    this.players = players;
    this.playerAirship = playerAirship;
    this.enemies = enemies;
    this.enemyAirship = enemyAirship;
    this.isAirCombat = isAirCombat;
  }

  ArePlayersDefeated(): boolean {
    if (this.isAirCombat && this.playerAirship !== null)
      return this.playerAirship.isDead();

    // All critical players are dead
    return this.players
      .filter((player) => player.isCritical)
      .every((player) => player.isDead());
  }

  AreEnemiesDefeated(): boolean {
    if (this.isAirCombat && this.enemyAirship !== null)
      return this.enemyAirship.isDead();

    // All critical enemies are dead
    return this.enemies
      .filter((enemy) => enemy.isCritical)
      .every((enemy) => enemy.isDead());
  }

  GetCombatant(faction: Faction, index: number) {
    return faction === Faction.Players
      ? this.players[index]
      : this.enemies[index];
  }

  GetCombatantFromSelf(combatant: Combatant): Combatant {
    return this.GetCombatant(combatant.faction, combatant.index);
  }

  GetCombatantAsPlayer(combatant: Combatant): Player | null {
    if (!combatant.isPlayer()) {
      return null;
    }
    return this.players[combatant.index];
  }

  getPlayerCaptain(): Player | null {
    if (this.playerAirship !== null)
      return this.players[this.playerAirship.indexPlayerCaptain];
    else return null;
  }

  getPlayerEngineer(): Player | null {
    if (this.playerAirship !== null)
      return this.players[this.playerAirship.indexPlayerEngineer];
    else return null;
  }

  clone(): CombatState {
    let clonePlayers = this.players.map((player) => player.clone());
    let cloneEnemies = this.enemies.map((combatant) => combatant.clone());
    return new CombatState(
      clonePlayers,
      this.playerAirship?.clone() ?? null,
      cloneEnemies,
      this.enemyAirship?.clone() ?? null,
      this.isAirCombat
    );
  }
}
