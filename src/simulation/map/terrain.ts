import { Attack } from "../../enum";

export class Terrain {
  name: string;
  attackBoost: (attackType: Attack) => number;
  defenseBoost: (defenseType: Attack) => number;

  constructor(
    name: string,
    attackBoost: (attackType: Attack) => number,
    defenseBoost: (defenseType: Attack) => number
  ) {
    this.name = name;
    this.attackBoost = attackBoost;
    this.defenseBoost = defenseBoost;
  }
}

export const TerrainDefault = new Terrain(
  "Default",
  (attackType) => 0,
  (defenseType) => 0
);

export const TerrainCover = new Terrain(
  "Cover",
  (attackType) => 0,
  (defenseType) => (defenseType === Attack.Ranged ? 1 : 0)
);

export const TerrainExposed = new Terrain(
  "Exposed",
  (attackType) => 0,
  (defenseType) => (defenseType === Attack.Ranged ? -1 : 0)
);

export const TerrainVantage = new Terrain(
  "Vantage Point",
  (attackType) => (attackType === Attack.Ranged ? 1 : 0),
  (defenseType) => 0
);

export const TerrainUnstable = new Terrain(
  "Unstable",
  (attackType) => -1,
  (defenseType) => 0
);

export const TerrainUneven = new Terrain(
  "Uneven",
  (attackType) => (attackType === Attack.Melee ? -1 : 0),
  (defenseType) => 0
);

export const TerrainOptions = [
  TerrainDefault,
  TerrainCover,
  TerrainExposed,
  TerrainVantage,
  TerrainUnstable,
  TerrainUneven,
];
