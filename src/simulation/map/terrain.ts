import { AttackType } from "../../enum";

export class Terrain {
  name: string;
  attackBoost: (attackType: AttackType) => number;
  defenseBoost: (defenseType: AttackType) => number;

  constructor(
    name: string,
    attackBoost: (attackType: AttackType) => number,
    defenseBoost: (defenseType: AttackType) => number
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
  (defenseType) => (defenseType === AttackType.Ranged ? 1 : 0)
);

export const TerrainExposed = new Terrain(
  "Exposed",
  (attackType) => 0,
  (defenseType) => (defenseType === AttackType.Ranged ? -1 : 0)
);

export const TerrainVantage = new Terrain(
  "Vantage Point",
  (attackType) => (attackType === AttackType.Ranged ? 1 : 0),
  (defenseType) => 0
);

export const TerrainUnstable = new Terrain(
  "Unstable",
  (attackType) => (attackType !== AttackType.Special ? -1 : 0),
  (defenseType) => 0
);

export const TerrainUneven = new Terrain(
  "Uneven",
  (attackType) => (attackType === AttackType.Melee ? -1 : 0),
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
