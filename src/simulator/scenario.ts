import Combatant, { initialTokens } from "../combatants/combatant";
import { Player, initialPlayerHealth } from "../combatants/player";
import { GameState } from "./state";
import { GameMap } from "../map/map";

export interface CombatScenario {
    enemySetPrimary : EnemySet,
    enemySetSecondary : EnemySet,
    playerSet : PlayerSet,
    startingFocus : number,
    map : GameMap
}

export interface PlayerSet {
    rgpicac : number[][];
}

export function rgplayerFromPlayerSet(playerSet : PlayerSet, actions : number, startingFocus : number) {
    let rgplayer : Player[] = [];
    playerSet.rgpicac.forEach((picac : number[], index : number) => {
        rgplayer.push(new Player(index, initialPlayerHealth, actions, initialTokens, 0, 0, picac, startingFocus));
    })
    return rgplayer;
}

export interface EnemySet {
    cNormal : number;
    cDangerous : number;
    cTough : number;
    cScary : number;
}

function Total(enemySet : EnemySet) : number {
    return enemySet.cNormal + enemySet.cDangerous + enemySet.cTough + enemySet.cScary;
}

const enemyNormal = (index: number, baseActions : number, isCritical : boolean) => new Combatant(index, 4, 1, initialTokens, 0, 0, isCritical);
const enemyDangerous = (index: number, baseActions : number, isCritical : boolean) => new Combatant(index, 8, 2, initialTokens, 0, 0, isCritical);
const enemyTough = (index: number, baseActions : number, isCritical : boolean) => new Combatant(index, 12, 2, initialTokens, 0, 0, isCritical);
const enemyScary = (index: number, baseActions : number, isCritical : boolean) => new Combatant(index, 16, 4, initialTokens, 0, 0, isCritical);

function rgEnemyByType(
    startingIndex : number,
    cenemy : number,
    fnEnemy : (index: number, baseActions : number, isCritical : boolean) => Combatant,
    baseActions : number,
    isCritical : boolean)
{
  let rgenemy = [];
  for(let i = 0; i < cenemy; i++)
    rgenemy.push(fnEnemy(startingIndex + i, baseActions, isCritical));
  
  return rgenemy;
}

export function rgEnemyFromEnemySet(i : number, enemySet : EnemySet, baseActions : number, isCritical : boolean) {
    let rgenemy : Combatant[] = [];
    let startingIndex = i;
    rgenemy = rgenemy.concat(rgEnemyByType(startingIndex, enemySet.cNormal, enemyNormal, baseActions, isCritical));
    startingIndex += enemySet.cNormal;
    rgenemy = rgenemy.concat(rgEnemyByType(startingIndex, enemySet.cDangerous, enemyDangerous, baseActions, isCritical));
    startingIndex += enemySet.cDangerous;
    rgenemy = rgenemy.concat(rgEnemyByType(startingIndex, enemySet.cTough, enemyTough, baseActions, isCritical));
    startingIndex += enemySet.cTough;
    rgenemy = rgenemy.concat(rgEnemyByType(startingIndex, enemySet.cScary, enemyScary, baseActions, isCritical));
    return rgenemy;
}

export function InitialStateFromScenario(scenario : CombatScenario) : GameState {
    let baseActions = 2;
    let rgplayer = rgplayerFromPlayerSet(scenario.playerSet, baseActions, scenario.startingFocus);
    let startingIndex = 0;
    let rgenemy : Combatant[] = [];
    rgenemy = rgenemy.concat(rgEnemyFromEnemySet(startingIndex, scenario.enemySetPrimary, baseActions, true /* primary enemies are critical */));
    startingIndex += Total(scenario.enemySetPrimary);
    rgenemy = rgenemy.concat(rgEnemyFromEnemySet(startingIndex, scenario.enemySetSecondary, baseActions, false /* secondary enemies are not */));
    return new GameState(rgplayer, rgenemy, scenario.map);
}