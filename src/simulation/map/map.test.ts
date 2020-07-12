import { Dijkstras } from "./map";

let testMapAdjacency = [
  [false, true, true, false], // start node is adjacent to 2 and 3
  [true, false, false, true], // mid nodes are adjacent to start and end, but not eachother
  [true, false, false, true],
  [false, true, true, false],
]; // end node is adjacent to 2 and 3

test("Dijkstras Algorithm implementation", () => {
  // Run dijkstra's on each node
  let dijkstras0 = Dijkstras(testMapAdjacency, 0);
  expect(dijkstras0.distances).toEqual([0, 1, 1, 2]);
  expect(dijkstras0.nextStepToward).toEqual([-1, 1, 2, 1]);

  let dijkstras1 = Dijkstras(testMapAdjacency, 1);
  expect(dijkstras1.distances).toEqual([1, 0, 2, 1]);
  expect(dijkstras1.nextStepToward).toEqual([0, -1, 0, 3]);

  let dijkstras2 = Dijkstras(testMapAdjacency, 2);
  expect(dijkstras2.distances).toEqual([1, 2, 0, 1]);
  expect(dijkstras2.nextStepToward).toEqual([0, 0, -1, 3]);

  let dijkstras3 = Dijkstras(testMapAdjacency, 3);
  expect(dijkstras3.distances).toEqual([2, 1, 1, 0]);
  expect(dijkstras3.nextStepToward).toEqual([1, 1, 2, -1]);
});
