import { SimulateCombat } from './combatBalance'

test('4 Players, Similar Numbers, Medium Difficulty', () => {
  console.log(SimulateCombat(
    { cNormal: 0, cDangerous: 2, cTough: 0, cScary: 0 },
    { cNormal: 0, cDangerous: 2, cTough: 0, cScary: 0 },
    4, 2, true));
});