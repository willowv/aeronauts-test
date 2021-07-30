import { Boost } from "../../enum";

export enum Quadrant {
  A = 0,
  B,
  C,
  D,
}

export function AllQuadrants(): Quadrant[] {
  return [Quadrant.A, Quadrant.B, Quadrant.C, Quadrant.D];
}

function QuadrantsAdjacentTo(quadrant: Quadrant): Quadrant[] {
  switch (quadrant) {
    case Quadrant.A:
      return [Quadrant.B, Quadrant.C];
    case Quadrant.B:
      return [Quadrant.A, Quadrant.D];
    case Quadrant.C:
      return [Quadrant.A, Quadrant.D];
    case Quadrant.D:
      return [Quadrant.B, Quadrant.C];
  }
}

export enum WeaponType {
  None = 0,
  Ground,
  Cannon,
  Torpedo,
  Bomb,
  AA,
  FighterGuns,
}

export class Airship {
  frontQuadrant: Quadrant;
  healthByQuadrant: number[];
  braceByQuadrant: number[];
  exposureTokensByQuadrant: number[];
  speedTokens: number[];
  advantageTokensByQuadrant: number[];
  disadvantageTokensByQuadrant: number[];
  suppressionByQuadrant: boolean[];

  constructor(
    frontQuadrant: Quadrant,
    health: number[],
    brace: number[],
    exposureTokens: number[],
    speedTokens: number[],
    advantageTokensByQuadrant: number[],
    disadvantageTokensByQuadrant: number[],
    suppressionByQuadrant: boolean[]
  ) {
    this.frontQuadrant = frontQuadrant;
    this.healthByQuadrant = health;
    this.braceByQuadrant = brace;
    this.exposureTokensByQuadrant = exposureTokens;
    this.speedTokens = speedTokens;
    this.advantageTokensByQuadrant = advantageTokensByQuadrant;
    this.disadvantageTokensByQuadrant = disadvantageTokensByQuadrant;
    this.suppressionByQuadrant = suppressionByQuadrant;
  }

  clone(): Airship {
    return new Airship(
      this.frontQuadrant,
      [...this.healthByQuadrant],
      [...this.braceByQuadrant],
      [...this.exposureTokensByQuadrant],
      [...this.speedTokens],
      [...this.advantageTokensByQuadrant],
      [...this.disadvantageTokensByQuadrant],
      [...this.suppressionByQuadrant]
    );
  }

  resetBraceAndSuppression(): void {
    this.braceByQuadrant = [0, 0, 0, 0];
    this.suppressionByQuadrant = [false, false, false, false];
  }

  getAdjustedHealthOfQuadrant(quadrant: Quadrant): number {
    return (
      this.healthByQuadrant[quadrant] +
      this.braceByQuadrant[quadrant] -
      this.exposureTokensByQuadrant[quadrant]
    );
  }

  validAttackQuadrants(): Quadrant[] {
    let quadrants = [];
    switch (this.frontQuadrant) {
      case Quadrant.A:
        quadrants = [Quadrant.A, Quadrant.B, Quadrant.C];
        break;
      case Quadrant.B:
        quadrants = [Quadrant.B];
        break;
      case Quadrant.C:
        quadrants = [Quadrant.C];
        break;
      case Quadrant.D:
        quadrants = [Quadrant.B, Quadrant.C];
        break;
    }
    return quadrants.filter((quadrant) => this.healthByQuadrant[quadrant] > 0);
  }

  validTargetQuadrants(weaponType: WeaponType): Quadrant[] {
    let quadrants: Quadrant[] = [];
    switch (weaponType) {
      case WeaponType.Cannon:
        quadrants = [this.frontQuadrant];
        break;
      case WeaponType.Torpedo:
        quadrants = this.frontThreeQuadrants();
        break;
      case WeaponType.Bomb:
        quadrants = AllQuadrants();
        break;
    }
    return quadrants.filter((quadrant) => this.healthByQuadrant[quadrant] > 0);
  }

  bestAttackingQuadrant(targetAirship: Airship): Quadrant | null {
    // for each valid attacking quadrant, are there any valid target quadrants?
    let candidates = this.validAttackQuadrants();
    candidates = candidates.filter((attackQuadrant) => {
      let weaponType =
        attackQuadrant === Quadrant.A ? WeaponType.Cannon : WeaponType.Torpedo;
      return targetAirship.validTargetQuadrants(weaponType).length > 0;
    });
    if (candidates.length === 0) return null;

    let attackValue: (quadrant: Quadrant) => number = (quadrant) => {
      let target = this.bestTargetQuadrantForAttackFrom(
        quadrant,
        targetAirship
      );
      return (
        this.advantageTokensByQuadrant[quadrant] -
        this.disadvantageTokensByQuadrant[quadrant] -
        targetAirship.getAdjustedHealthOfQuadrant(target)
      );
    };
    candidates.sort((a, b) => attackValue(b) - attackValue(a));
    return candidates[0];
  }

  bestTargetQuadrantForAttackFrom(
    attackingQuadrant: Quadrant,
    targetAirship: Airship
  ): Quadrant {
    let weaponType =
      attackingQuadrant === Quadrant.A ? WeaponType.Cannon : WeaponType.Torpedo;
    let candidates = targetAirship.validTargetQuadrants(weaponType);
    candidates.sort(
      (a, b) =>
        targetAirship.getAdjustedHealthOfQuadrant(a) -
        targetAirship.getAdjustedHealthOfQuadrant(b)
    );
    return candidates[0];
  }

  bestTargetQuadrant(weaponType: WeaponType): Quadrant | null {
    let candidates: Quadrant[] = [];
    switch (weaponType) {
      case WeaponType.Cannon:
        candidates.push(this.frontQuadrant);
        break;
      case WeaponType.Torpedo:
        candidates = this.frontThreeQuadrants();
        break;
      case WeaponType.Bomb:
        candidates = AllQuadrants();
        let safeCandidates = candidates.filter(
          (quadrant) =>
            this.suppressionByQuadrant[quadrant] &&
            this.healthByQuadrant[quadrant] > 0
        );
        if (safeCandidates.length > 0) candidates = safeCandidates;
        break;
    }
    candidates = candidates.filter(
      (candidate) => this.healthByQuadrant[candidate] > 0
    ); // only consider targetable quadrants
    return this.worstQuadrantOfSetForDefense(candidates);
  }

  worstQuadrantOfSetForDefense(candidates: Quadrant[]): Quadrant | null {
    let worstQuadrant = null;
    let worstAdjustedHealth = 15;
    candidates.forEach((quadrant) => {
      let adjustedHealth = this.getAdjustedHealthOfQuadrant(quadrant);
      if (
        adjustedHealth < worstAdjustedHealth &&
        this.healthByQuadrant[quadrant] > 0
      ) {
        worstAdjustedHealth = adjustedHealth;
        worstQuadrant = quadrant;
      }
    });
    return worstQuadrant;
  }

  bestQuadrantOfSetForDefense(candidates: Quadrant[]): Quadrant {
    // Of current front and adjacent quadrants, what has the best health + brace - exposure (and isn't destroyed yet)?
    let bestQuadrant = this.frontQuadrant;
    let bestAdjustedHealth = 0;
    candidates.forEach((quadrant) => {
      let adjustedHealth = this.getAdjustedHealthOfQuadrant(quadrant);
      if (
        adjustedHealth > bestAdjustedHealth &&
        this.healthByQuadrant[quadrant] > 0
      ) {
        bestAdjustedHealth = adjustedHealth;
        bestQuadrant = quadrant;
      }
    });
    return bestQuadrant;
  }

  bestQuadrantOfSetForOffense(candidates: Quadrant[]): Quadrant {
    // For offense we care that it's healthy, but also if it has an attack advantage
    let bestQuadrant = this.frontQuadrant;
    let bestAdjustedHealth = 0;
    candidates.forEach((quadrant) => {
      let offenseValue =
        this.getAdjustedHealthOfQuadrant(quadrant) +
        this.advantageTokensByQuadrant[quadrant] -
        this.disadvantageTokensByQuadrant[quadrant];
      if (
        offenseValue > bestAdjustedHealth &&
        this.healthByQuadrant[quadrant] > 0 &&
        quadrant !== Quadrant.D
      ) {
        // quadrant D has no weapons (in this simulation)
        bestAdjustedHealth = offenseValue;
        bestQuadrant = quadrant;
      }
    });
    return bestQuadrant;
  }

  frontThreeQuadrants(): Quadrant[] {
    return [this.frontQuadrant, ...QuadrantsAdjacentTo(this.frontQuadrant)];
  }

  targetableQuadrants(weaponType: WeaponType): Quadrant[] {
    switch (weaponType) {
      case WeaponType.Cannon:
        return [this.frontQuadrant];
      case WeaponType.Bomb:
        return AllQuadrants();
      case WeaponType.Torpedo:
        return this.frontThreeQuadrants();
    }
    return [];
  }

  takeDamage(quadrant: Quadrant, damage: number): void {
    if (this.healthByQuadrant[quadrant] <= 0) return;

    let unbracedDamage = Math.max(0, damage - this.braceByQuadrant[quadrant]);
    let remainingBrace = Math.max(0, this.braceByQuadrant[quadrant] - damage);
    this.braceByQuadrant[quadrant] = remainingBrace;
    this.healthByQuadrant[quadrant] -= unbracedDamage;
    if (this.healthByQuadrant[quadrant] <= 0)
      this.speedTokens[Boost.Negative] += 3;
  }

  isDead(): boolean {
    let quadrantsRemaining = 0;
    this.healthByQuadrant.forEach((health) => {
      if (health <= 0) quadrantsRemaining++;
    });
    return quadrantsRemaining <= 1;
  }

  getBoostForAttackOnQuadrant(quadrant: Quadrant): number {
    let exposure = Math.min(1, this.exposureTokensByQuadrant[quadrant]);
    let speedPos = Math.min(1, this.speedTokens[Boost.Positive]);
    let speedNeg = Math.min(1, this.speedTokens[Boost.Negative]);
    this.exposureTokensByQuadrant[quadrant] -= exposure;
    this.speedTokens[Boost.Negative] -= speedNeg;
    this.speedTokens[Boost.Positive] -= speedPos;

    return exposure + speedNeg - speedPos;
  }

  getBoostForAttackFromQuadrant(quadrant: Quadrant): number {
    let advantage = Math.min(1, this.advantageTokensByQuadrant[quadrant]);
    let disadvantage = Math.min(1, this.disadvantageTokensByQuadrant[quadrant]);
    this.advantageTokensByQuadrant[quadrant] -= advantage;
    this.disadvantageTokensByQuadrant[quadrant] -= disadvantage;

    return advantage - disadvantage;
  }

  takeBestMoves(): void {
    // Only self-rotate for this simulation
    // Goals: ensure that the strongest attack is available, but also hide the weakest quadrant (try to put in back or at least not in front)
    let offenseQuadrant = this.bestQuadrantOfSetForOffense(AllQuadrants());
    let validFrontQuadrants: Quadrant[] = [];
    if (
      offenseQuadrant === Quadrant.A &&
      this.frontThreeQuadrants().includes(offenseQuadrant)
    )
      validFrontQuadrants = [Quadrant.A];
    else if (offenseQuadrant === Quadrant.B)
      validFrontQuadrants = [Quadrant.A, Quadrant.B, Quadrant.D];
    else if (offenseQuadrant === Quadrant.C)
      validFrontQuadrants = [Quadrant.A, Quadrant.C, Quadrant.D];
    else validFrontQuadrants = AllQuadrants();

    validFrontQuadrants = validFrontQuadrants.filter(
      (quadrant) =>
        this.frontThreeQuadrants().includes(quadrant) &&
        this.healthByQuadrant[quadrant] > 0
    );
    let bestQuadrantForMove =
      this.bestQuadrantOfSetForDefense(validFrontQuadrants);
    this.frontQuadrant = bestQuadrantForMove;

    // Brace the weakest quadrant
    let weakestQuadrant =
      this.worstQuadrantOfSetForDefense(AllQuadrants()) ?? this.frontQuadrant;
    this.braceByQuadrant[weakestQuadrant] += 2;
  }
}
