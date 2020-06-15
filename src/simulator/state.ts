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
import { Token, Boost, Ability } from "./enum";
import Combatant from "../combatants/combatant";

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
}

function RunPCTurn(PC : Player, initialState : GameState) : GameState {
    return initialState;
}

function RunNPCTurn(NPC : Combatant, initialState : GameState) : GameState {
    // Temporary AI
    let rgplayerTarget = initialState.combatantsPC
    .filter((player) => !player.isDead()) // filter out dead players
    .sort((a, b) => b.health - a.health); // target player with the highest health

    // TODO: incorporate map data

    if(rgplayerTarget.length === 0)
        return initialState; // no players to target

    /*
    let target = 0;
    for(let action = 0; action < NPC.actions; action++) {
        let player = rgplayerTarget[target];
        let checkResult = player.defend(Ability.Agility, Token.Defense, this.getBoost(Token.Action));
        if(checkResult < 10)
            player.takeDamage(5, 0); // need to determine component

        else if (checkResult < 15)
            player.takeDamage(2, 0);

        if(player.isDead())
        {
            target++;
            if(target >= rgplayerTarget.length)
                return action + 1; // no enemy to target
        }
    }*/
    return initialState;
}

export function RunRound(initialState : GameState) : GameState {
    let state = initialState;
    for(let i = 0; i < state.combatantsPC.length; i++) { //assumes number and index of combatants does not change
      state = RunPCTurn(state.combatantsPC[i], state);
    }
    for(let i = 0; i < state.combatantsNPC.length; i++) {
      state = RunNPCTurn(state.combatantsNPC[i], state);
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
          PC.actions * 3 +
          PC.tokens[Token.Action][Boost.Positive]
          - PC.tokens[Token.Action][Boost.Negative];
      }
    });

    state.combatantsNPC.forEach((NPC : Combatant) => {
      if(!NPC.isDead()) {
        defenseScore +=
          NPC.tokens[Token.Action][Boost.Negative]
          - NPC.tokens[Token.Action][Boost.Positive]
          - NPC.actions * 2;

        offenseScore +=
          NPC.tokens[Token.Defense][Boost.Negative]
          - NPC.tokens[Token.Defense][Boost.Positive]
          - NPC.health;
      }
    });

    return defenseScore + offenseScore;
}