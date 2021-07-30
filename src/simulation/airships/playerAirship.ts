import { Airship, Quadrant } from "./airship";

export class PlayerAirship extends Airship {
  indexPlayerCaptain: number;
  indexPlayerEngineer: number;

  constructor(
    frontQuadrant: Quadrant,
    health: number[],
    brace: number[],
    exposureTokens: number[],
    speedTokens: number[],
    advantageTokensByQuadrant: number[],
    disadvantageTokensByQuadrant: number[],
    suppressionByQuadrant: boolean[],
    indexPlayerCaptain: number,
    indexPlayerEngineer: number
  ) {
    super(
      frontQuadrant,
      health,
      brace,
      exposureTokens,
      speedTokens,
      advantageTokensByQuadrant,
      disadvantageTokensByQuadrant,
      suppressionByQuadrant
    );
    this.indexPlayerCaptain = indexPlayerCaptain;
    this.indexPlayerEngineer = indexPlayerEngineer;
  }

  clone(): PlayerAirship {
    return new PlayerAirship(
      this.frontQuadrant,
      [...this.healthByQuadrant],
      [...this.braceByQuadrant],
      [...this.exposureTokensByQuadrant],
      [...this.speedTokens],
      [...this.advantageTokensByQuadrant],
      [...this.disadvantageTokensByQuadrant],
      [...this.suppressionByQuadrant],
      this.indexPlayerCaptain,
      this.indexPlayerEngineer
    );
  }
}
