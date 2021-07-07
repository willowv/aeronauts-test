import { Action } from "./actions/action";
import { Boost, CombatantType, Faction } from "../../enum";
import { AI } from "./ai/ai";
import Combatant from "./combatant";
import { Targetable } from "./targetable";

export class Airship implements Targetable {
  indexTargetable: number;
  health: number[];
  maxHealthPerQuadrant: number;
  indexExposed: number;
  actionTokens: number[][]; // by pos/neg and by quadrant index
  exposureTokens: number[];
  speedTokens: number[];
  brace: number[];
  faction: Faction;

  constructor(
    indexTargetable: number,
    health: number[],
    maxHealthPerQuadrant: number,
    indexExposed: number,
    actionTokens: number[][],
    exposureTokens: number[],
    speedTokens: number[],
    brace: number[],
    faction: Faction
  ) {
    this.indexTargetable = indexTargetable;
    this.health = health;
    this.maxHealthPerQuadrant = maxHealthPerQuadrant;
    this.indexExposed = indexExposed;
    this.actionTokens = actionTokens;
    this.exposureTokens = exposureTokens;
    this.speedTokens = speedTokens;
    this.brace = brace;
    this.faction = faction;
  }
  getLowestQuadrant(): { index: number; health: number } {
    let indexLowest = 0;
    let healthLowest = 15;
    this.health.forEach((quadrantHealth, index) => {
      if (quadrantHealth < healthLowest) {
        indexLowest = index;
        healthLowest = quadrantHealth;
      }
    });
    return { index: indexLowest, health: healthLowest };
  }

  addHealth(amount: number): void {
    // add health to lowest non-dead quadrant
    let { index, health } = this.getLowestQuadrant();
    this.health[index] += amount;
  }
  getHealth(): number {
    // get health from lowest non-dead quadrant
    let { index, health } = this.getLowestQuadrant();
    return health;
  }
  getMaxHealth(): number {
    return this.maxHealthPerQuadrant;
  }
  clone(): Targetable {
    return new Airship(
      this.indexTargetable,
      this.health,
      this.maxHealthPerQuadrant,
      this.indexExposed,
      this.actionTokens,
      this.exposureTokens,
      this.speedTokens,
      this.brace,
      this.faction
    );
  }

  isDead(): boolean {
    let quadrantsAlive = 0;
    this.health.forEach((quadrant) => {
      if (quadrant > 0) quadrantsAlive++;
    });
    return quadrantsAlive >= 2;
  }

  isCritical(): boolean {
    return true;
  }

  takeDamage(amount: number): void {
    if (this.health[this.indexExposed] <= 0) return;

    let damageLeftover = Math.max(0, amount - this.brace[this.indexExposed]);
    this.brace[this.indexExposed] = Math.max(
      0,
      this.brace[this.indexExposed] - amount
    );
    this.health[this.indexExposed] -= damageLeftover;
    if (this.health[this.indexExposed] <= 0)
      this.speedTokens[Boost.Negative] += 3;
  }
  getDefenseTokens(boost: Boost): number {
    let tokens = this.speedTokens[boost];
    if (boost === Boost.Negative) {
      tokens += this.exposureTokens[this.indexExposed];
    }
    return tokens;
  }
  setDefenseTokens(boost: Boost, num: number): void {
    if (boost === Boost.Negative) {
      this.exposureTokens[this.indexExposed] = num;
    } else {
      this.speedTokens[boost] = num;
    }
  }
  getBoostVsAttackAndConsumeTokens(): number {
    if (this.health[this.indexExposed] <= 0) return 0;

    let speedPosBoost = Math.max(1, this.speedTokens[Boost.Positive]);
    let speedNegBoost = Math.max(1, this.speedTokens[Boost.Negative]);
    let exposureBoost = Math.max(1, this.exposureTokens[this.indexExposed]);
    this.speedTokens[Boost.Positive] -= speedPosBoost;
    this.speedTokens[Boost.Negative] -= speedNegBoost;
    this.exposureTokens[this.indexExposed] -= exposureBoost;

    return speedPosBoost - speedNegBoost - exposureBoost;
  }
  getTargetType(): CombatantType {
    return CombatantType.Airship;
  }
  getFaction(): Faction {
    return this.faction;
  }
  getIndexTargetable(): number {
    return this.indexTargetable;
  }
}
