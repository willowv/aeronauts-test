import { CombatState } from "./state";
import { CombatantType, Faction } from "../enum";
import { Scenario } from "./scenario";
import Combatant from "./combatants/combatant";
import {
  ScenarioReport,
  ScenarioReportFromCombatReports,
  CombatReportFromFinalState,
  CombatReport,
} from "./statistics";
import { Player } from "./combatants/player";
import { RollDice } from "./dice";
import { Action, ActionType, SourceType } from "./combatants/actions/action";
import { Quadrant } from "./airships/airship";

const roundLimit = 20;

// Given number of each type of enemy, number of players, assumed focus percentage, and who goes first
// Return number of total actions and number of threat actions
export function SimulateScenario(
  scenario: Scenario,
  numberOfTrials: number
): ScenarioReport {
  let initialState = scenario.getInitialCombatState();
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
    let currentPlayer = state.GetCombatantFromSelf(player);
    if (currentPlayer.isDead()) return; // dead players don't get a turn
    state = SimulateTurn(state, currentPlayer);
  });
  state.enemies.forEach((enemy) => {
    let currentEnemy = state.GetCombatantFromSelf(enemy);
    if (currentEnemy.isDead()) return; // dead enemies don't get a turn
    state = SimulateTurn(state, currentEnemy);
  });
  return state;
}

function SimulateTurn(
  initialState: CombatState,
  combatant: Combatant
): CombatState {
  let state = initialState;
  for (let actionNum = 0; actionNum < combatant.actionsPerTurn; actionNum++) {
    let { action, source, target } = combatant.ai.FindBestActionAndTarget(
      state,
      combatant
    );
    state = Act(state, combatant, source, action, target, RollDice);
    let newCombatant = state.GetCombatantFromSelf(combatant);
    newCombatant.actionsTaken++;
  }
  return state;
}

export function Act(
  initialState: CombatState,
  initiator: Combatant,
  actor: Combatant | Quadrant,
  action: Action,
  target: Combatant | Quadrant,
  checkEvaluator: (modifier: number, boost: number) => number
): CombatState {
  let state = initialState;
  if (action.type === ActionType.Uncontested || action.ability === null)
    return action.evaluate(15, actor, target, state); // Actions that don't have abilities are automatic

  let modifier = 0;
  if (action.actorFaction === Faction.Players)
    modifier = (initiator as Player).getModifierForRoll(action.ability);
  else if (action.targetFaction === Faction.Players) {
    if (action.targetType === CombatantType.Airship)
      modifier =
        state.getPlayerCaptain()?.getModifierForRoll(action.ability) ?? 0;
    else modifier = (target as Player).getModifierForRoll(action.ability);
  }

  let sourceBoost = 0;
  if (action.sourceType === SourceType.Personal)
    sourceBoost = (actor as Combatant).getBoostForAttackFromMe();
  else {
    let airship =
      action.actorFaction === Faction.Players
        ? state.playerAirship
        : state.enemyAirship;
    sourceBoost =
      airship?.getBoostForAttackFromQuadrant(actor as Quadrant) ?? 0;
  }

  let targetBoost = 0;
  if (action.targetType !== CombatantType.Airship)
    targetBoost = (target as Combatant).getBoostForAttackOnMe();
  else {
    let airship =
      action.actorFaction === Faction.Players
        ? state.playerAirship
        : state.enemyAirship;
    targetBoost = airship?.getBoostForAttackOnQuadrant(target as Quadrant) ?? 0;
  }

  let checkResult = checkEvaluator(modifier, sourceBoost + targetBoost);
  return action.evaluate(checkResult, actor, target, state);
}
