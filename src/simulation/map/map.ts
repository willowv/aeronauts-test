interface XY {
  x: number;
  y: number;
}

export class CombatMap {
  moveAdjacency: boolean[][]; // X,Y is true if zone X and zone Y are adjacent, false otherwise
  distanceBetween: number[][]; // X,Y is the number of moves to get between X and Y
  nextStepBetween: number[][]; // X, Y is the next move you would take to go shortest path from X to Y
  positioning: XY[]; // calculate positions of these nodes for visualization
  zoneNames: string[];

  constructor(zoneNames: string[], moveAdjacency: boolean[][]) {
    this.moveAdjacency = moveAdjacency;
    this.distanceBetween = [];
    this.nextStepBetween = [];
    this.positioning = [];
    this.zoneNames = zoneNames;
    for (let zone = 0; zone < this.moveAdjacency.length; zone++) {
      let dijkstras = Dijkstras(this.moveAdjacency, zone);
      this.distanceBetween[zone] = dijkstras.distances;
      this.nextStepBetween[zone] = dijkstras.nextStepToward;
    }
    // Hardcode the positioning of zones for air combat
    this.positioning[0] = {x: 2, y: 1};
    this.positioning[1] = {x: 1, y: 0};
    this.positioning[2] = {x: 0, y: 1};
    this.positioning[3] = {x: 1, y: 2};
    this.positioning[4] = {x: 4, y: 1};
    this.positioning[5] = {x: 5, y: 2};
    this.positioning[6] = {x: 6, y: 1};
    this.positioning[7] = {x: 5, y: 0};
    this.positioning[8] = {x: 3, y: 1};
    this.positioning[9] = {x: 1, y: 1};
    this.positioning[10] = {x: 5, y: 1};
  }

  ZonesMovableFrom(zoneStart: number): number[] {
    return ZonesAdjacentTo(zoneStart, this.moveAdjacency);
  }

  clone() {
    return new CombatMap(this.zoneNames, this.moveAdjacency);
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
