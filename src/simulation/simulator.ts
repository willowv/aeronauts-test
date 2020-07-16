import { CombatState } from "./state";
import { Token, Boost, AttackType } from "../enum";
import { Scenario, InitialStateFromScenario } from "./scenario";
import Combatant from "./combatants/combatant";
import {
  ScenarioReport,
  ScenarioReportFromCombatReports,
  CombatReportFromFinalState,
  CombatReport,
} from "./statistics";
import {
  RunPCAction as SimulatePlayerAction,
  RunNPCAction as SimulateEnemyAction,
} from "./combatants/ai";
import { Terrain } from "./map/terrain";

const roundLimit = 10;

// Given number of each type of enemy, number of players, assumed focus percentage, and who goes first
// Return number of total actions and number of threat actions
export function SimulateScenario(
  scenario: Scenario,
  numberOfTrials: number
): ScenarioReport {
  let initialState = InitialStateFromScenario(scenario);
  let combatReports = [];
  for (let trial = 0; trial < numberOfTrials; trial++) {
    combatReports.push(SimulateCombat(initialState));
  }
  return ScenarioReportFromCombatReports(combatReports);
}

function SimulateCombat(initialState: CombatState): CombatReport {
  let numberOfRounds = 0;
  let arePlayersDefeated = false;
  let areEnemiesDefeated = false;
  let state = initialState.clone();
  while (
    !areEnemiesDefeated &&
    !arePlayersDefeated &&
    numberOfRounds < roundLimit
  ) {
    numberOfRounds++;
    state = SimulateRound(state);
    arePlayersDefeated = state.ArePlayersDefeated();
    areEnemiesDefeated = state.AreEnemiesDefeated();
  }
  return CombatReportFromFinalState(
    !arePlayersDefeated && areEnemiesDefeated,
    state,
    numberOfRounds
  );
}

function SimulateRound(initialState: CombatState): CombatState {
  let state = initialState;
  for (let playerIndex = 0; playerIndex < state.players.length; playerIndex++) {
    //assumes number and index of combatants does not change
    if (!state.players[playerIndex].isDead())
      state = SimulatePlayerTurn(playerIndex, state);
  }
  for (let enemyIndex = 0; enemyIndex < state.enemies.length; enemyIndex++) {
    if (!state.enemies[enemyIndex].isDead())
      state = SimulateEnemyTurn(enemyIndex, state);
  }
  return state;
}

function SimulatePlayerTurn(
  playerIndex: number,
  initialState: CombatState
): CombatState {
  let state = initialState; // don't bother cloning, we don't mutate and only call pure functions
  let player = state.players[playerIndex];
  for (let action = 0; action < player.actionsPerTurn; action++) {
    state = SimulatePlayerAction(player.index, state);
  }
  return state;
}

function SimulateEnemyTurn(
  enemyIndex: number,
  initialState: CombatState
): CombatState {
  let state = initialState; // don't bother cloning, we don't mutate and only call pure functions
  let enemy = state.enemies[enemyIndex];
  for (let action = 0; action < enemy.actionsPerTurn; action++) {
    state = SimulateEnemyAction(enemy.index, state);
  }
  return state;
}

// mutates state, only pass in clones
export function ConsumeTokensAndGetAttackerBoost(
  terrain: Terrain[],
  attacker: Combatant,
  target: Combatant,
  attackType: AttackType
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
