import { Boost } from "../enum";

export function RollDice(modifier: number, boost: number): number {
  let d6 = 3 + Math.abs(boost);
  let rolls = Array(d6);
  for (let i = 0; i < d6; i++) {
    rolls[i] = Math.floor(Math.random() * 6 + 1);
  }
  let rollsSorted = rolls.sort((a, b) => a - b);
  if (boost > 0) {
    rollsSorted = rollsSorted.reverse(); // get highest three if boost is positive
  }
  return rollsSorted[0] + rollsSorted[1] + rollsSorted[2] + modifier;
}

export function ExpectedValueForBoostAndModifier(
  modifier: number,
  boost : number
) : number {
  let boostDirection =
    Math.sign(boost) === -1 ? Boost.Negative : Boost.Positive;
  let boostMagnitude = Math.abs(boost);
  return Math.round(expectedValueByBoost[boostDirection][boostMagnitude] + modifier);
}

const expectedValueByBoost : number[][] = [[],[]];
expectedValueByBoost[Boost.Negative][2] = 7.57;
expectedValueByBoost[Boost.Negative][1] = 8.76;
expectedValueByBoost[Boost.Positive][0] = 10.5;
expectedValueByBoost[Boost.Positive][1] = 12.24;
expectedValueByBoost[Boost.Positive][2] = 13.43;

export function ProbRollGreaterOrEqualToTarget(
  modifier: number,
  boost: number,
  target: number
): number {
  let boostDirection =
    Math.sign(boost) === -1 ? Boost.Negative : Boost.Positive;
  let boostMagnitude = Math.abs(boost);
  let probability = 0;
  let modifiedTarget = target - modifier;
  probabilityByBoostAndTarget[boostDirection][boostMagnitude].forEach(
    (probabilityOfResult, result) => {
      if (result >= modifiedTarget) probability += probabilityOfResult;
    }
  );
  return Math.round(probability * 1000) / 1000;
}

const probabilityByBoostAndTarget: number[][][] = [
  [[], [], []],
  [[], [], []],
];
probabilityByBoostAndTarget[Boost.Negative][2] = [
  0,
  0,
  0,
  276 / 7776,
  610 / 7776,
  935 / 7776,
  1111 / 7776,
  1155 / 7776,
  1055 / 7776,
  881 / 7776,
  665 / 7776,
  470 / 7776,
  296 / 7776,
  170 / 7776,
  90 / 7776,
  41 / 7776,
  15 / 7776,
  5 / 7776,
  1 / 7776,
];
probabilityByBoostAndTarget[Boost.Negative][1] = [
  0,
  0,
  0,
  21 / 1296,
  54 / 1296,
  94 / 1296,
  131 / 1296,
  160 / 1296,
  172 / 1296,
  167 / 1296,
  148 / 1296,
  122 / 1296,
  91 / 1296,
  62 / 1296,
  38 / 1296,
  21 / 1296,
  10 / 1296,
  4 / 1296,
  1 / 1296,
];
probabilityByBoostAndTarget[Boost.Positive][0] = [
  0,
  0,
  0,
  1 / 216,
  3 / 216,
  6 / 216,
  10 / 216,
  15 / 216,
  21 / 216,
  25 / 216,
  27 / 216,
  27 / 216,
  25 / 216,
  21 / 216,
  15 / 216,
  10 / 216,
  6 / 216,
  3 / 216,
  1 / 216,
];
probabilityByBoostAndTarget[Boost.Positive][1] = [
  0,
  0,
  0,
  1 / 1296,
  4 / 1296,
  10 / 1296,
  21 / 1296,
  38 / 1296,
  62 / 1296,
  91 / 1296,
  122 / 1296,
  148 / 1296,
  167 / 1296,
  172 / 1296,
  160 / 1296,
  131 / 1296,
  94 / 1296,
  54 / 1296,
  21 / 1296,
];
probabilityByBoostAndTarget[Boost.Positive][2] = [
  0,
  0,
  0,
  1 / 7776,
  5 / 7776,
  15 / 7776,
  41 / 7776,
  90 / 7776,
  170 / 7776,
  296 / 7776,
  470 / 7776,
  665 / 7776,
  881 / 7776,
  1055 / 7776,
  1155 / 7776,
  1111 / 7776,
  935 / 7776,
  610 / 7776,
  276 / 7776,
];
