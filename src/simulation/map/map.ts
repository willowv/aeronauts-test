import { Terrain } from "./terrain";

interface XY {
  x: number;
  y: number;
}

export class CombatMap {
  terrain: Terrain[];
  moveAdjacency: boolean[][]; // X,Y is true if zone X and zone Y are adjacent, false otherwise
  distanceBetween: number[][]; // X,Y is the number of moves to get between X and Y
  nextStepBetween: number[][]; // X, Y is the next move you would take to go shortest path from X to Y
  positioning: XY[]; // calculate positions of these nodes for visualization

  constructor(terrain: Terrain[], moveAdjacency: boolean[][]) {
    this.terrain = terrain;
    this.moveAdjacency = moveAdjacency;
    this.distanceBetween = [];
    this.nextStepBetween = [];
    this.positioning = [];
    for (let zone = 0; zone < this.terrain.length; zone++) {
      let dijkstras = Dijkstras(this.moveAdjacency, zone);
      this.distanceBetween[zone] = dijkstras.distances;
      this.nextStepBetween[zone] = dijkstras.nextStepToward;
    }
    // Starting from start node, get all of the nodes that are distance 1, place them at x + 1, spread across y
    // Then all of the nodes that are distance 2, place them at x + 2, spread across y, etc.
    this.positioning[0] = {x: 0, y: 0};
    let columns : number[][] = [];
    this.distanceBetween[0].forEach((distance, zone) => {
      if(columns[distance] === undefined)
        columns[distance] = [];
      
      columns[distance].push(zone);
    })
    columns.forEach((zones, x) => {
      zones.forEach((zone, y) => {
        this.positioning[zone] = {x: x, y: y};
      })
    })
  }

  ZonesMovableFrom(zoneStart: number): number[] {
    return ZonesAdjacentTo(zoneStart, this.moveAdjacency);
  }

  clone() {
    return new CombatMap(this.terrain, this.moveAdjacency);
  }
}

export function ZonesAdjacentTo(
  zoneStart: number,
  adjacencyMatrix: boolean[][]
): number[] {
  let zonesDest: number[] = [];
  for (let zone = 0; zone < adjacencyMatrix.length; zone++) {
    if (zoneStart === zone) continue;
    if (adjacencyMatrix[zoneStart][zone]) zonesDest.push(zone);
  }
  return zonesDest;
}

interface DijkstrasOutput {
  distances: number[];
  nextStepToward: number[];
}

export function Dijkstras(
  adjacencyMatrix: boolean[][],
  zoneStart: number
): DijkstrasOutput {
  // initialize
  // positioning - x increment when we add new children to the stack, y increment for each child after the first
  let distances: number[] = []; // track distance to each zone
  let prevStep: number[] = []; // track which zone was before this on shortest path
  let zoneVisited: boolean[] = []; // track whether zone has been visited
  adjacencyMatrix.forEach((_, zone) => {
    prevStep[zone] = -1;
    if (zone === zoneStart) distances[zone] = 0;
    else distances[zone] = Infinity;

    zoneVisited[zone] = false;
  });

  //execute
  let zoneQueue = [zoneStart];
  while (zoneQueue.length > 0) {
    let zoneCur = zoneQueue.shift() ?? -1;
    zoneVisited[zoneCur] = true;
    adjacencyMatrix.forEach((_, zone) => {
      if (adjacencyMatrix[zoneCur][zone]) {
        let tentativeDistance = distances[zoneCur] + 1;
        if (distances[zone] > tentativeDistance) {
          distances[zone] = tentativeDistance;
          prevStep[zone] = zoneCur;
        }
        if (!zoneVisited[zone]) {
          zoneQueue.push(zone);
        }
      }
    });
  }

  // process prevStep to get nextStep
  let nextStepToward = [];
  for (let zoneDest = 0; zoneDest < adjacencyMatrix.length; zoneDest++) {
    if (zoneDest === zoneStart) {
      nextStepToward[zoneDest] = -1;
      continue;
    }

    let prospectiveNextStep = zoneDest;
    while (prospectiveNextStep !== zoneStart && prospectiveNextStep !== -1) {
      if (prevStep[prospectiveNextStep] === zoneStart) {
        nextStepToward[zoneDest] = prospectiveNextStep;
        break;
      }
      prospectiveNextStep = prevStep[prospectiveNextStep];
    }
  }

  return { distances, nextStepToward };
}
