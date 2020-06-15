import { Attack } from "../simulator/enum";

export class Terrain {
    attackBoost : (attackType : Attack) => number;
    defenseBoost : (defenseType : Attack) => number;

    constructor(
        attackBoost : (attackType : Attack) => number,
        defenseBoost : (defenseType : Attack) => number
    ) {
        this.attackBoost = attackBoost;
        this.defenseBoost = defenseBoost;
    }
}

export const TerrainDefault = new Terrain(
    (attackType) => 0,
    (defenseType) => 0);

export const TerrainCover = new Terrain(
    (attackType) => 0,
    (defenseType) => defenseType == Attack.Ranged ? 1 : 0);

export const TerrainExposed = new Terrain(
    (attackType) => 0,
    (defenseType) => defenseType == Attack.Ranged ? -1 : 0);

export const TerrainVantage = new Terrain(
    (attackType) => attackType == Attack.Ranged ? 1 : 0,
    (defenseType) => 0);

export const TerrainUnstable = new Terrain(
    (attackType) => -1,
    (defenseType) => 0);

export const TerrainUneven = new Terrain(
    (attackType) => attackType == Attack.Melee ? -1 : 0,
    (defenseType) => 0);