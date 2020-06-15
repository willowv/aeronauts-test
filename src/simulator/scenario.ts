import Combatant, { initialTokens } from "../combatants/combatant";
import { Player, initialPlayerHealth } from "../combatants/player";
import { TestMap } from "../map/map";
import { GameState } from "./state";

export interface CombatScenario {
    enemySetPrimary : EnemySet,
    enemySetSecondary : EnemySet,
    playerSet : PlayerSet,
    startingFocus : number
}

export interface PlayerSet {
    rgpicac : number[][];
}

export function rgplayerFromPlayerSet(playerSet : PlayerSet, actions : number, startingFocus : number) {
    let rgplayer : Player[] = [];
    playerSet.rgpicac.forEach((picac : number[]) => {
        rgplayer.push(new Player(initialPlayerHealth, actions, initialTokens, 0, 0, picac, startingFocus));
    })
    return rgplayer;
}

export interface EnemySet {
    cNormal : number;
    cDangerous : number;
    cTough : number;
    cScary : number;
}

const enemyNormal = (baseActions : number, isCritical : boolean) => new Combatant(4, 1, initialTokens, 0, 0, isCritical);
const enemyDangerous = (baseActions : number, isCritical : boolean) => new Combatant(8, 2, initialTokens, 0, 0, isCritical);
const enemyTough = (baseActions : number, isCritical : boolean) => new Combatant(12, 2, initialTokens, 0, 0, isCritical);
const enemyScary = (baseActions : number, isCritical : boolean) => new Combatant(16, 4, initialTokens, 0, 0, isCritical);

export const TestNPC = enemyDangerous(2, true);

function rgEnemyByType(
    cenemy : number,
    fnEnemy : (baseActions : number, isCritical : boolean) => Combatant,
    baseActions : number,
    isCritical : boolean)
{
  let rgenemy = [];
  for(let i = 0; i < cenemy; i++)
    rgenemy.push(fnEnemy(baseActions, isCritical));
  
  return rgenemy;
}

export function rgEnemyFromEnemySet(enemySet : EnemySet, baseActions : number, isCritical : boolean) {
    let rgenemy : Combatant[] = [];
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cNormal, enemyNormal, baseActions, isCritical));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cDangerous, enemyDangerous, baseActions, isCritical));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cTough, enemyTough, baseActions, isCritical));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cScary, enemyScary, baseActions, isCritical));
    return rgenemy;
}

export function InitialStateFromScenario(scenario : CombatScenario) : GameState {
    let baseActions = 2;
    let rgplayer = rgplayerFromPlayerSet(scenario.playerSet, baseActions, scenario.startingFocus);
    let rgenemy =
      rgEnemyFromEnemySet(scenario.enemySetPrimary, baseActions, true /* primary enemies are critical */).concat(
      rgEnemyFromEnemySet(scenario.enemySetSecondary, baseActions, false /* secondary enemies are not */));
  
    return new GameState(rgplayer, rgenemy, TestMap);
}