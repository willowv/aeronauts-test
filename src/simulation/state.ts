import { Player } from "./combatants/player";
import { GameMap } from "./map/map";
import Combatant from "./combatants/combatant";

export class CombatState {
  players: Player[];
  enemies: Combatant[];
  map: GameMap;

  constructor(players: Player[], enemies: Combatant[], map: GameMap) {
    this.players = players;
    this.enemies = enemies;
    this.map = map;
  }

  ArePlayersDefeated(): boolean {
    let defeat = true;
    this.players.forEach((player: Combatant) => {
      if (!player.isDead() && player.isCritical) defeat = false;
    });
    return defeat;
  }

  AreEnemiesDefeated(): boolean {
    let defeat = true;
    this.enemies.forEach((enemy: Combatant) => {
      if (!enemy.isDead() && enemy.isCritical) defeat = false;
    });
    return defeat;
  }

  clone(): CombatState {
    let clonePlayers = this.players.map((player) => player.clone());
    let cloneEnemies = this.enemies.map((combatant) => combatant.clone());
    return new CombatState(clonePlayers, cloneEnemies, this.map);
  }
}
