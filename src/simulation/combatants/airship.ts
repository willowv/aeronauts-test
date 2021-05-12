import Target from "./target";
import { Faction } from "../../enum";

export enum ShipZone {
    A = 0,
    B,
    C,
    D
}

export class Quadrant extends Target {
    shipZone: ShipZone;

    constructor(
        shipZone: ShipZone,
        health: number,
        maxHealth: number,
        tokens: number[][],
        faction: Faction,
        isSuppressed: boolean,
      ) {
        super(health, maxHealth, tokens, faction, isSuppressed);
        this.shipZone = shipZone;
      }

    clone() : Quadrant {
        return new Quadrant(
            this.shipZone,
            this.health,
            this.maxHealth,
            this.tokens,
            this.faction,
            this.isSuppressed
        )
    }
}

export const initialSpeedTokens: () => number[] = () => [0, 0];

export class Airship {
    speedTokens: number[];
    faction: Faction;
    quadrants : Quadrant[];
    zoneOfA : number;

    constructor(
        speedTokens : number[],
        faction : Faction,
        quadrants : Quadrant[],
        zoneOfA : number
    ) {
        this.speedTokens = speedTokens;
        this.faction = faction;
        this.quadrants = quadrants;
        this.zoneOfA = zoneOfA;
    }

    // enum clockwise/cc
    // function for rotating
    // function for getting

    GetZoneOfQuadrant(shipZone : ShipZone) {
        // If faction is player, defined for 0-3
        // North => 0: C, 1: A, 2: D, 3: B
        // East => 0: A, 1: B, 2: C, 3: D
        // South => 0: B, 1: D, 2: A, 3: C
        // West => 0: D, 1: C, 2: B, 3: A
        // (zone 0, facing 0) = 
        // If faction is npc, defined for 4-7
        if(this.faction === Faction.Players) {
            //(this.zoneOfA + shipZone) % 4
        }
        else { // Faction.Enemies

        }
    }
}