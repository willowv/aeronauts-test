export enum Attack {
    Ranged = 0,
    Melee
}

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

export const Default = new Terrain(
    (attackType) => 0,
    (defenseType) => 0);

export const Cover = new Terrain(
    (attackType) => 0,
    (defenseType) => defenseType == Attack.Ranged ? 1 : 0);

export const Exposed = new Terrain(
    (attackType) => 0,
    (defenseType) => defenseType == Attack.Ranged ? -1 : 0);

export const Vantage = new Terrain(
    (attackType) => attackType == Attack.Ranged ? 1 : 0,
    (defenseType) => 0);

export const Unstable = new Terrain(
    (attackType) => -1,
    (defenseType) => 0);

export const Uneven = new Terrain(
    (attackType) => attackType == Attack.Melee ? -1 : 0,
    (defenseType) => 0);