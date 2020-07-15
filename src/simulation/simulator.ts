import { GameState } from "./state";
import { Token, Boost, Attack } from "../enum";
import { Scenario, InitialStateFromScenario } from "./scenario";
import Combatant from "./combatants/combatant";
import {
  ScenarioReport,
  GetScenarioStats,
  getCombatStats,
  CombatStats,
} from "./statistics";
import { RunPCAction, RunNPCAction } from "./combatants/ai";
import { Terrain } from "./map/terrain";

const cRoundLimit = 10;

// Given number of each type of enemy, number of players, assumed focus percentage, and who goes first
// Return number of total actions and number of threat actions
export function SimulateScenario(
  scenario: Scenario,
  trials: number
): ScenarioReport {
  let initialState = InitialStateFromScenario(scenario);
  let combatStats = [];
  for (let trial = 0; trial < trials; trial++) {
    combatStats.push(SimulateCombat(initialState));
  }
  return GetScenarioStats(combatStats);
}

function SimulateCombat(initialState: GameState): CombatStats {
  let cRound = 0;
  let arePlayersDefeated = false;
  let isPrimaryDefeated = false;
  let state = initialState.clone();
  while (!isPrimaryDefeated && !arePlayersDefeated && cRound < cRoundLimit) {
    cRound++;
    state = RunRound(state);
    arePlayersDefeated = state.ArePlayersDefeated();
    isPrimaryDefeated = state.AreEnemiesDefeated();
  }
  return getCombatStats(
    !arePlayersDefeated && isPrimaryDefeated,
    state,
    cRound
  );
}

function RunRound(initialState: GameState): GameState {
  let state = initialState;
  for (
    let playerIndex = 0;
    playerIndex < state.combatantsPC.length;
    playerIndex++
  ) {
    //assumes number and index of combatants does not change
    if (!state.combatantsPC[playerIndex].isDead())
      state = RunPCTurn(playerIndex, state);
  }
  for (let npcIndex = 0; npcIndex < state.combatantsNPC.length; npcIndex++) {
    if (!state.combatantsNPC[npcIndex].isDead())
      state = RunNPCTurn(npcIndex, state);
  }
  return state;
}

function RunPCTurn(playerIndex: number, initialState: GameState): GameState {
  let state = initialState; // don't bother cloning, we don't mutate and only call pure functions
  let PC = state.combatantsPC[playerIndex];
  for (let action = 0; action < PC.actionsPerTurn; action++) {
    state = RunPCAction(PC.index, state);
  }
  return state;
}

function RunNPCTurn(npcIndex: number, initialState: GameState): GameState {
  let state = initialState; // don't bother cloning, we don't mutate and only call pure functions
  let NPC = state.combatantsNPC[npcIndex];
  for (let action = 0; action < NPC.actionsPerTurn; action++) {
    state = RunNPCAction(NPC.index, state);
  }
  return state;
}

// mutates state, only pass in clones
export function AttackerBoost(
  terrain: Terrain[],
  attacker: Combatant,
  target: Combatant,
  attackType: Attack
): number {
  // how does source and target terrain affect this?
  let sourceTerrain = terrain[attacker.zone];
  let targetTerrain = terrain[target.zone];
  let boost =
    sourceTerrain.attackBoost(attackType) +
    targetTerrain.defenseBoost(attackType);
  if (attacker.tokens[Token.Action][Boost.Negative] > 0) {
    attacker.tokens[Token.Action][Boost.Negative] -= 1;
    boost -= 1;
  }
  if (target.tokens[Token.Defense][Boost.Negative] > 0) {
    target.tokens[Token.Defense][Boost.Negative] -= 1;
    boost += 1;
  }
  // Only use positive tokens if they'd have an effect
  if (boost > -2 && target.tokens[Token.Defense][Boost.Positive] > 0) {
    target.tokens[Token.Defense][Boost.Positive] -= 1;
    boost -= 1;
  }
  if (boost < 2 && attacker.tokens[Token.Action][Boost.Positive] > 0) {
    attacker.tokens[Token.Action][Boost.Positive] -= 1;
    boost += 1;
  }
  return Math.max(Math.min(boost, 2), -2); // boost has a max magnitude of 2
}
