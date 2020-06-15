import { Terrain, TerrainDefault } from "./terrain";

export class GameMap {
    terrain : Terrain[];
    moveAdjacency : boolean[][]; // X,Y is 1 if zone X and zone Y are adjacent, 0 otherwise
    visibleAdjacency : boolean[][]; // X,Y is 1 if zone X and zone Y are visible from eachother, 0 otherwise
    shortcutAdjacency : boolean[][]; // X,Y is 1 if zone X and zone Y have a shortcut between them, 0 otherwise

    constructor(
        terrain : Terrain[],
        moveAdjacency : boolean[][],
        visibleAdjacency : boolean[][],
        shortcutAdjacency : boolean[][]) {
            this.terrain = terrain;
            this.moveAdjacency = moveAdjacency;
            this.visibleAdjacency = visibleAdjacency;
            this.shortcutAdjacency = shortcutAdjacency;
    }

    ZonesMovableFrom(zoneStart : number) : number[] {
        return this.ZonesAdjacentTo(zoneStart, this.moveAdjacency);
    }

    ZonesVisibleFrom(zoneStart : number) : number[] {
        return this.ZonesAdjacentTo(zoneStart, this.visibleAdjacency);
    }

    ZonesShortcutFrom(zoneStart : number) : number[] {
        return this.ZonesAdjacentTo(zoneStart, this.shortcutAdjacency);
    }

    ZonesAdjacentTo(zoneStart : number, adjacencyMatrix : boolean[][]) : number[] {
        let zonesDest : number[] = [];
        for(let zone = 0; zone < this.terrain.length; zone++) {
          if(zoneStart === zone) continue;
          if(adjacencyMatrix[zoneStart][zone])
            zonesDest.push(zone);
        }
        return zonesDest;
    }
}

export const TestMap : GameMap = new GameMap(
    [TerrainDefault, TerrainDefault],
    [[true, true], [true, true]],
    [[true, true], [true, true]],
    [[false, false], [false, false]]);