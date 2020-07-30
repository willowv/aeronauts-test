import { CombatState } from "./state";
import { Token, Boost, AttackType, CombatantType, Ability } from "../enum";
import { Scenario, InitialStateFromScenario } from "./scenario";
import Combatant from "./combatants/combatant";
import {
  ScenarioReport,
  ScenarioReportFromCombatReports,
  CombatReportFromFinalState,
  CombatReport,
} from "./statistics";
import { Player } from "./combatants/player";
import { PlayerAI } from "./combatants/ai/playerAi";
import { RollDice } from "./dice";
import { AI } from "./combatants/ai/ai";
import { EnemyAI } from "./combatants/ai/enemyAi";
import { Action } from "./combatants/actions/action";

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
  let state = initialState.clone();
  while (numberOfRounds < roundLimit) {
    numberOfRounds++;
    state = SimulateRound(state);
    if (state.AreEnemiesDefeated()) break;
    if (state.ArePlayersDefeated()) break;
  }
  return CombatReportFromFinalState(state, numberOfRounds);
}

function SimulateRound(initialState: CombatState): CombatState {
  let state = initialState;
  state.players.forEach((player) => {
    if (player.isDead()) return; // dead players don't get a turn
    state = SimulateTurn(PlayerAI, state, player);
  });
  state.enemies.forEach((enemy) => {
    if (enemy.isDead()) return; // dead enemies don't get a turn
    state = SimulateTurn(EnemyAI, state, enemy);
  });
  return state.ClearSuppression();
}

function SimulateTurn(
  ai: AI,
  initialState: CombatState,
  combatant: Combatant
): CombatState {
  let state = initialState;
  for (let actionNum = 0; actionNum < combatant.actionsPerTurn; actionNum++) {
    let bestActionAndTarget = ai.FindBestActionAndTarget(state, combatant);
    if (bestActionAndTarget !== null) {
      let action = bestActionAndTarget.action;
      let target = bestActionAndTarget.target;
      state = Act(state, combatant, action, target, RollDice, ai);
    } else {
      let bestMove = ai.FindBestMove(state, combatant);
      if (bestMove !== null)
        state = Move(state, combatant, bestMove, RollDice, ai);
    }
    let newCombatant = state.GetCombatant(combatant);
    newCombatant.actionsTaken++;
  }
  return state;
}

export function Act(
  initialState: CombatState,
  actor: Combatant,
  action: Action,
  target: Combatant,
  checkEvaluator: (modifier: number, boost: number) => number,
  ai: AI
): CombatState {
  let {
    modifier,
    boost,
    state: actionState,
  } = GetModifierBoostAndStateForPlayerRoll(
    initialState,
    actor,
    target,
    action.ability,
    action.type
  );
  let checkResult = checkEvaluator(modifier, boost);
  return action.evaluate(checkResult, actor, target, actionState, ai);
}

export function Move(
  initialState: CombatState,
  actor: Combatant,
  zoneDest: number,
  checkEvaluator: (modifier: number, boost: number) => number,
  ai: AI
): CombatState {
  let state = initialState.clone();
  let newActor = state.GetCombatant(actor);
  let freeAttackers = newActor.isPlayer() ? state.enemies : state.players;
  // Filter to living, non-suppressed enemies in the same zone, with a weapon that can target
  freeAttackers = freeAttackers.filter((attacker) => {
    let weapon = attacker.actions[0];
    return (
      !attacker.isDead() &&
      attacker.zone === newActor.zone &&
      !attacker.isSuppressed &&
      weapon.minRange === 0
    );
  });
  // Execute attacks
  freeAttackers.forEach((freeAttacker) => {
    let weapon = freeAttacker.actions[0];
    state = Act(state, freeAttacker, weapon, newActor, checkEvaluator, ai);
    newActor = state.GetCombatant(newActor);
  });
  newActor.zone = zoneDest;
  return state;
}

// does not mutate
export function GetModifierBoostAndStateForPlayerRoll(
  initialState: CombatState,
  attacker: Combatant,
  target: Combatant,
  ability: Ability,
  attackType: AttackType
): { modifier: number; boost: number; state: CombatState } {
  let state = initialState.clone();
  let newAttacker = state.GetCombatant(attacker);
  let newTarget = state.GetCombatant(target);
  let isPlayerAttacking = newAttacker.combatantType === CombatantType.Player;
  let isPlayerDefending = newTarget.combatantType === CombatantType.Player;

  let player: Player | null;
  if (isPlayerAttacking) {
    player = state.GetCombatantAsPlayer(newAttacker);
  } else if (isPlayerDefending) {
    player = state.GetCombatantAsPlayer(newTarget);
  } else {
    player = null;
  }
  let modifier: number = player?.abilityScores[ability] ?? 0;
  if (player !== null && player.focus > 0) {
    player.focus -= 1;
    modifier += 1;
  }

  // how does source and target terrain affect this?
  let sourceTerrain = state.map.terrain[newAttacker.zone];
  let targetTerrain = state.map.terrain[newTarget.zone];
  let boost =
    sourceTerrain.attackBoost(attackType) +
    targetTerrain.defenseBoost(attackType);
  if (newAttacker.tokens[Token.Action][Boost.Negative] > 0) {
    newAttacker.tokens[Token.Action][Boost.Negative] -= 1;
    boost -= 1;
  }
  if (newTarget.tokens[Token.Defense][Boost.Negative] > 0) {
    newTarget.tokens[Token.Defense][Boost.Negative] -= 1;
    boost += 1;
  }
  // Only use positive tokens if they'd have an effect
  if (boost > -2 && newTarget.tokens[Token.Defense][Boost.Positive] > 0) {
    newTarget.tokens[Token.Defense][Boost.Positive] -= 1;
    boost -= 1;
  }
  if (boost < 2 && newAttacker.tokens[Token.Action][Boost.Positive] > 0) {
    newAttacker.tokens[Token.Action][Boost.Positive] -= 1;
    boost += 1;
  }
  boost = Math.max(Math.min(boost, 2), -2); // boost has a max magnitude of 2
  return {
    modifier: modifier,
    boost: isPlayerAttacking ? boost : -boost,
    state: state,
  };
}
