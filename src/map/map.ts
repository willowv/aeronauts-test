import { Enemy, TestNPC } from "../combatants/enemy";
import { Player, TestPC } from "../combatants/player";
import { Terrain, TerrainDefault } from "./terrain";

export class Zone {
    occupantsNPC: Enemy[];
    occupantsPC: Player[];
    terrain : Terrain;
    index : number;

    constructor(
        occupantsNPC: Enemy[],
        occupantsPC: Player[],
        terrain : Terrain,
        index : number) {
            this.occupantsNPC = occupantsNPC;
            this.occupantsPC = occupantsPC;
            this.terrain = terrain;
            this.index = index;
    }
}

export class GameMap {
    zones : Zone[];
    moveAdjacency : boolean[][]; // X,Y is 1 if zone X and zone Y are adjacent, 0 otherwise
    visibleAdjacency : boolean[][]; // X,Y is 1 if zone X and zone Y are visible from eachother, 0 otherwise
    shortcutAdjacency : boolean[][]; // X,Y is 1 if zone X and zone Y have a shortcut between them, 0 otherwise

    constructor(
        allZones : Zone[],
        moveAdjacency : boolean[][],
        visibleAdjacency : boolean[][],
        shortcutAdjacency : boolean[][]) {
            this.zones = allZones;
            this.moveAdjacency = moveAdjacency;
            this.visibleAdjacency = visibleAdjacency;
            this.shortcutAdjacency = shortcutAdjacency;
    }

    ZonesMovableFrom(zoneStart : Zone) : Zone[] {
        return this.ZonesAdjacentTo(zoneStart, this.moveAdjacency);
    }

    ZonesVisibleFrom(zoneStart : Zone) : Zone[] {
        return this.ZonesAdjacentTo(zoneStart, this.visibleAdjacency);
    }

    ZonesShortcutFrom(zoneStart : Zone) : Zone[] {
        return this.ZonesAdjacentTo(zoneStart, this.shortcutAdjacency);
    }

    ZonesAdjacentTo(zoneStart : Zone, adjacencyMatrix : boolean[][]) : Zone[] {
        let zonesDest : Zone[] = [];
        this.zones.forEach(zoneProspectiveDest => {
            if(zoneStart.index === zoneProspectiveDest.index) return;
            if(adjacencyMatrix[zoneStart.index][zoneProspectiveDest.index])
                zonesDest.push(zoneProspectiveDest);
        });
        return zonesDest;
    }
}

export const TestMap : GameMap = new GameMap([
    new Zone([],[TestPC], TerrainDefault, 0),
    new Zone([TestNPC], [], TerrainDefault, 1)],
    [[true, true], [true, true]],
    [[true, true], [true, true]],
    [[false, false], [false, false]]);