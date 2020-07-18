import { CombatState } from "../state";
import { ConsumeTokensAndGetAttackerBoost } from "../simulator";
import { RollDice } from "../dice";
import Combatant from "./combatant";
import { GameMap } from "../map/map";

export function RunPCAction(
  playerIndex: number,
  initialState: CombatState
): CombatState {
  let state = initialState.clone();
  let PC = state.players[playerIndex];
  // Filter to remaining alive targets
  let aliveTargets = state.enemies.filter((combatant) => {
    return !combatant.isDead();
  });
  if (aliveTargets.length === 0) return initialState;

  // What do I want to do?
  // Default to "standard" for now, which is attacking the closest enemy with the lowest health
  let weapon = PC.actions[0];
  let validEnemies = GetValidTargets(
    PC.zone,
    aliveTargets,
    state.map,
    weapon.minRange,
    weapon.maxRange
  );
  if (validEnemies.length === 0) {
    let prioritizedEnemies = aliveTargets.sort((a, b) => a.health - b.health);
    let target = prioritizedEnemies[0];
    if (target.zone === PC.zone) {
      // too close with rifle, move anywhere else
      let moves = state.map.ZonesMovableFrom(PC.zone);
      PC.zone = moves[0];
    } else {
      // get closer to target
      PC.zone = state.map.nextStepBetween[PC.zone][target.zone];
    }
    PC.actionsTaken++;
    return state;
  }

  let prioritizedEnemies = validEnemies.sort((a, b) => a.health - b.health);
  let target = prioritizedEnemies[0];

  // attack
  let boost = ConsumeTokensAndGetAttackerBoost(
    state.map.terrain,
    PC,
    target,
    weapon.type
  );
  let bonus = PC.abilityScores[weapon.ability];
  if (PC.focus > 0) {
    PC.focus -= 1;
    bonus += 1;
  }
  let checkResult = RollDice(bonus, boost);
  weapon.evaluate(checkResult, PC, target, state);
  PC.actionsTaken++;

  // TODO: try doing AI using heuristic score function
  return state;
}

function GetValidTargets(
  zone: number,
  targets: Combatant[],
  map: GameMap,
  minRange: number,
  maxRange: number
): Combatant[] {
  // get all enemies that are the same, lowest number of actions to target
  let validTargets = targets.filter((combatant) => {
    let distance = map.distanceBetween[zone][combatant.zone];
    return distance <= maxRange && distance >= minRange;
  });
  return validTargets;
}

export function RunNPCAction(
  npcIndex: number,
  initialState: CombatState
): CombatState {
  let state = initialState.clone();
  let NPC = state.enemies[npcIndex];
  // Filter to remaining alive targets
  let aliveTargets = state.players.filter((combatant) => {
    return !combatant.isDead();
  });
  if (aliveTargets.length === 0) return initialState;

  // What do I want to do?
  // Default to "standard" for now, which is attacking the closest enemy with the lowest health
  let weapon = NPC.actions[0];
  let validEnemies = GetValidTargets(
    NPC.zone,
    aliveTargets,
    state.map,
    weapon.minRange,
    weapon.maxRange
  );
  if (validEnemies.length === 0) {
    let prioritizedEnemies = aliveTargets.sort((a, b) => b.health - a.health);
    let target = prioritizedEnemies[0];
    if (target.zone === NPC.zone) {
      // too close with rifle, move anywhere else
      let moves = state.map.ZonesMovableFrom(NPC.zone);
      NPC.zone = moves[0];
    } else {
      // get closer to target
      NPC.zone = state.map.nextStepBetween[NPC.zone][target.zone];
    }
    NPC.actionsTaken++;
    return state;
  }

  // NPC DIFFERENCES - target highest health
  let prioritizedEnemies = validEnemies.sort((a, b) => b.health - a.health);
  let target = state.players[prioritizedEnemies[0].index]; // get the player from the combatant

  // attack
  let boost = -ConsumeTokensAndGetAttackerBoost(
    state.map.terrain,
    NPC,
    target,
    weapon.type
  ); // player rolls for defense
  let bonus = target.abilityScores[weapon.ability];
  if (target.focus > 0) {
    target.focus -= 1;
    bonus += 1;
  }
  let checkResult = RollDice(bonus, boost);
  weapon.evaluate(checkResult, NPC, target, state);
  NPC.actionsTaken++;
  return state;
}
