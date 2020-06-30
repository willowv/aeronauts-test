/*
There is a game runner, which takes in a game state, runs a round, and then returns a new game state
A round iterates through players executing turns and then enemies executing turns
A turn consists of examining game state and deciding on an action, then repeating until out of actions
An action takes in a game state and returns a new game state

=> A player/enemy needs a set of actions, and a way to decide which to use
game state has a representation of all the players, enemies, and the map
the map has all the zones, below
*/

import { Player } from "../combatants/player";
import { GameMap } from "../map/map";
import { Token, Boost, Ability, Attack } from "./enum";
import Combatant from "../combatants/combatant";
import { Terrain } from "../map/terrain";
import { rollDice } from "./dice";

export class GameState {
    combatantsPC : Player[];
    combatantsNPC : Combatant[];
    map : GameMap;
  
    constructor(
      combatantsPC : Player[],
      combatantsNPC : Combatant[],
      map : GameMap
    ) {
      this.combatantsPC = combatantsPC;
      this.combatantsNPC = combatantsNPC;
      this.map = map;
    }

    ArePlayersDefeated() : boolean {
      let defeat = true;
        this.combatantsPC.forEach((player : Combatant) => {
            if(!player.isDead() && player.isCritical)
                defeat = false;
        });
        return defeat;
    }

    AreEnemiesDefeated() : boolean {
      let defeat = true;
        this.combatantsNPC.forEach((enemy : Combatant) => {
            if(!enemy.isDead() && enemy.isCritical)
                defeat = false;
        });
        return defeat;
    }

    clone() : GameState {
      let cloneCombatantsPC = this.combatantsPC.map((player) => player.clone());
      let cloneCombatantsNPC = this.combatantsNPC.map((combatant) => combatant.clone());
      return new GameState(cloneCombatantsPC, cloneCombatantsNPC, this.map);
    }
}

function RunPCTurn(playerIndex : number, initialState : GameState) : GameState {  
  let state = initialState; // don't bother cloning, we don't mutate and only call pure functions
  let PC = state.combatantsPC[playerIndex];
  for(let action = 0; action < PC.actionsPerTurn; action++) {
    state = RunPCAction(PC.index, state);
  }
  return state;
}

function RunPCAction(playerIndex : number, initialState : GameState) : GameState {
  let state = initialState.clone();
  let PC = state.combatantsPC[playerIndex];
  // Filter to remaining alive targets
  let aliveTargets = state.combatantsNPC.filter((combatant) => {
    return !combatant.isDead();
  });
  if(aliveTargets.length === 0)
    return initialState;

  // What do I want to do?
  // Default to "standard" for now, which is attacking the closest enemy with the lowest health
  let weapon = PC.actions[0];
  let validEnemies = GetValidTargets(PC.zone, state.combatantsNPC, state.map, weapon.minRange, weapon.maxRange);
  if(validEnemies.length === 0) {
    // TODO: Decide on a move location
    let moves = state.map.ZonesMovableFrom(PC.zone);
    PC.zone = moves[0];
    PC.actionsTaken++;
    return state;
  }

  let prioritizedEnemies = validEnemies.sort((a, b) => a.health - b.health);
  let target = prioritizedEnemies[0];

  // attack
  let boost = AttackerBoost(state.map.terrain, PC, target, weapon.type);
  let bonus = PC.abilityScores[weapon.ability];
  if(PC.focus > 0)
  {
    PC.focus -= 1;
    bonus += 1;
  }
  let checkResult = rollDice(bonus, boost);
  weapon.evaluate(checkResult, PC, target, state);
  PC.actionsTaken++;

  // TODO: try doing AI using heuristic score function
  return state;
}

// mutates state, only pass in clones
function AttackerBoost(terrain : Terrain[], attacker : Combatant, target : Combatant, attackType : Attack) : number {
  // how does source and target terrain affect this?
  let sourceTerrain = terrain[attacker.zone];
  let targetTerrain = terrain[target.zone];
  let boost = sourceTerrain.attackBoost(attackType) + targetTerrain.defenseBoost(attackType);
  if(attacker.tokens[Token.Action][Boost.Negative] > 0) {
    attacker.tokens[Token.Action][Boost.Negative] -= 1;
    boost -= 1;
  }
  if(target.tokens[Token.Defense][Boost.Negative] > 0) {
    target.tokens[Token.Defense][Boost.Negative] -= 1;
    boost += 1;
  }
  // Only use positive tokens if they'd have an effect
  if(boost > -2 && target.tokens[Token.Defense][Boost.Positive] > 0) {
    target.tokens[Token.Defense][Boost.Positive] -= 1;
    boost -= 1;
  }
  if(boost < 2 && attacker.tokens[Token.Action][Boost.Positive] > 0) {
    attacker.tokens[Token.Action][Boost.Positive] -= 1;
    boost += 1;
  }
  return Math.max(Math.min(boost, 2), -2); // boost has a max magnitude of 2
}

function GetValidTargets(zone : number, targets : Combatant[], map : GameMap, minRange : number, maxRange : number) : Combatant[] {
  // get all enemies that are the same, lowest number of actions to target
  let validTargets = targets.filter((combatant) => {
    let distance = map.distanceBetween[zone][combatant.zone];
    return distance <= maxRange && distance >= minRange;
  });
  return validTargets;
}

function RunNPCTurn(npcIndex : number, initialState : GameState) : GameState {  
  let state = initialState; // don't bother cloning, we don't mutate and only call pure functions
  let NPC = state.combatantsNPC[npcIndex];
  for(let action = 0; action < NPC.actionsPerTurn; action++) {
    state = RunNPCAction(NPC.index, state);
  }
  return state;
}

function RunNPCAction(npcIndex : number, initialState : GameState) : GameState {
  let state = initialState.clone();
  let NPC = state.combatantsNPC[npcIndex];
  // Filter to remaining alive targets
  let aliveTargets = state.combatantsPC.filter((combatant) => {
    return !combatant.isDead();
  });
  if(aliveTargets.length === 0)
    return initialState;

  // What do I want to do?
  // Default to "standard" for now, which is attacking the closest enemy with the lowest health
  let weapon = NPC.actions[0];
  let validEnemies = GetValidTargets(NPC.zone, state.combatantsPC, state.map, weapon.minRange, weapon.maxRange);
  if(validEnemies.length === 0) {
    // TODO: Decide on a move location
    let moves = state.map.ZonesMovableFrom(NPC.zone);
    NPC.zone = moves[0];
    NPC.actionsTaken++;
    return state;
  }

  // NPC DIFFERENCES - target highest health
  let prioritizedEnemies = validEnemies.sort((a, b) => b.health - a.health);
  let target = state.combatantsPC[prioritizedEnemies[0].index]; // get the player from the combatant

  // attack
  let boost = - AttackerBoost(state.map.terrain, NPC, target, weapon.type); // player rolls for defense
  let bonus = target.abilityScores[weapon.ability];
  if(target.focus > 0)
  {
    target.focus -= 1;
    bonus += 1;
  }
  let checkResult = rollDice(bonus, boost);
  weapon.evaluate(checkResult, NPC, target, state);
  NPC.actionsTaken++;
  return state;
}

export function RunRound(initialState : GameState) : GameState {
    let state = initialState;
    for(let playerIndex = 0; playerIndex < state.combatantsPC.length; playerIndex++) { //assumes number and index of combatants does not change
      if(!state.combatantsPC[playerIndex].isDead())
        state = RunPCTurn(playerIndex, state);
    }
    for(let npcIndex = 0; npcIndex < state.combatantsNPC.length; npcIndex++) {
      if(!state.combatantsNPC[npcIndex].isDead())
        state = RunNPCTurn(npcIndex, state);
    }
    return state;
}

// Heuristic evaluation of how "good" this board state is for players
export function Score(state : GameState) : number {
    let defenseScore = 0;
    let offenseScore = 0;
    state.combatantsPC.forEach((PC : Player) => {
      if(!PC.isDead()) {
        defenseScore += 
          PC.health
          + PC.tokens[Token.Defense][Boost.Positive]
          - PC.tokens[Token.Defense][Boost.Negative];

        offenseScore +=
          PC.actionsPerTurn * 3 +
          PC.tokens[Token.Action][Boost.Positive]
          - PC.tokens[Token.Action][Boost.Negative];
      }
    });

    state.combatantsNPC.forEach((NPC : Combatant) => {
      if(!NPC.isDead()) {
        defenseScore +=
          NPC.tokens[Token.Action][Boost.Negative]
          - NPC.tokens[Token.Action][Boost.Positive]
          - NPC.actionsPerTurn * 2;

        offenseScore +=
          NPC.tokens[Token.Defense][Boost.Negative]
          - NPC.tokens[Token.Defense][Boost.Positive]
          - NPC.health;
      }
    });

    return defenseScore + offenseScore;
}