import { SimulateCombat } from './combatBalance'

test('4 Players, Similar Numbers, Medium Difficulty', () => {
  console.log(SimulateCombat(
    { cNormal: 0, cDangerous: 2, cTough: 0, cScary: 0 },
    { cNormal: 0, cDangerous: 2, cTough: 0, cScary: 0 },
    { rgpicac: [
        [2, 1, 1, 0, 0],
        [0, 2, 1, 1, 0],
        [0, 0, 2, 1, 1],
        [1, 0, 0, 2, 1],
      ]
    }, true, 12));
});