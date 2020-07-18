import { ProbRollGreaterOrEqualToTarget } from './dice'

test("Probability Table", () => {
    // Check that 100% chance of rolling greater than or equal to 3 for every boost
    expect(ProbRollGreaterOrEqualToTarget(0, -2, 3)).toEqual(1);
    expect(ProbRollGreaterOrEqualToTarget(0, -1, 3)).toEqual(1);
    expect(ProbRollGreaterOrEqualToTarget(0, 0, 3)).toEqual(1);
    expect(ProbRollGreaterOrEqualToTarget(0, 1, 3)).toEqual(1);
    expect(ProbRollGreaterOrEqualToTarget(0, 2, 3)).toEqual(1);

    // Check that 0% chance of rolling greater than 18 for every boost
    expect(ProbRollGreaterOrEqualToTarget(0, -2, 19)).toEqual(0);
    expect(ProbRollGreaterOrEqualToTarget(0, -1, 19)).toEqual(0);
    expect(ProbRollGreaterOrEqualToTarget(0, 0, 19)).toEqual(0);
    expect(ProbRollGreaterOrEqualToTarget(0, 1, 19)).toEqual(0);
    expect(ProbRollGreaterOrEqualToTarget(0, 2, 19)).toEqual(0);

    expect(ProbRollGreaterOrEqualToTarget(0, 0, 11)).toEqual(0.5);
    expect(ProbRollGreaterOrEqualToTarget(1, 0, 11)).toEqual(0.625);
    expect(ProbRollGreaterOrEqualToTarget(2, 0, 11)).toEqual(0.741);

    expect(ProbRollGreaterOrEqualToTarget(0, -2, 11)).toEqual(0.14);
    expect(ProbRollGreaterOrEqualToTarget(0, -1, 11)).toEqual(0.269);
    expect(ProbRollGreaterOrEqualToTarget(0, 1, 11)).toEqual(0.731);
    expect(ProbRollGreaterOrEqualToTarget(0, 2, 11)).toEqual(0.86);
  });