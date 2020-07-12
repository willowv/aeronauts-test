export function rollDice(modifier: number, boost: number): number {
  let d6 = 3 + Math.abs(boost);
  let rolls = Array(d6);
  for (let i = 0; i < d6; i++) {
    rolls[i] = Math.floor(Math.random() * 6 + 1);
  }
  let rollsSorted = rolls.sort();
  if (boost > 0) {
    rollsSorted = rollsSorted.reverse(); // get highest three if boost is positive
  }
  return rollsSorted[0] + rollsSorted[1] + rollsSorted[2] + modifier;
}
