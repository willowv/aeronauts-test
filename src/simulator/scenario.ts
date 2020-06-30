import Combatant, { initialTokens } from "../combatants/combatant";
import { Player, initialPlayerHealth } from "../combatants/player";
import { GameState } from "./state";
import { GameMap } from "../map/map";
import { Action } from "../combatants/actions/action";
import { NPCBasicAttack } from "../combatants/actions/npcActions";

export interface CombatScenario {
    enemySetPrimaryByZone : EnemySet[],
    enemySetSecondaryByZone : EnemySet[],
    playerSetByZone : PlayerSet[],
    startingFocus : number,
    map : GameMap
}

export class PlayerSet {
    rgpicac : number[][];
    rgweapon : Action[];

    constructor(rgpicac : number[][], rgweapon : Action[]) {
        this.rgpicac = rgpicac;
        this.rgweapon = rgweapon;
    }
}

export const EmptyPS = new PlayerSet([], []);

export class EnemySet {
    cNormal : number;
    cDangerous : number;
    cTough : number;
    cScary : number;

    constructor(cNormal : number, cDangerous : number, cTough : number, cScary : number) {
        this.cNormal = cNormal;
        this.cDangerous = cDangerous;
        this.cTough = cTough;
        this.cScary = cScary;
    }
}

export const EmptyES = new EnemySet(0, 0, 0, 0);

export function rgplayerFromPlayerSetByZone(playerSetByZone : PlayerSet[], startingFocus : number) {
    let rgplayer : Player[] = [];
    let index = 0;
    playerSetByZone.forEach((playerSet : PlayerSet, zone : number) => {
        playerSet.rgpicac.forEach((picac : number[], weaponIndex : number) => {
            rgplayer.push(new Player(index, initialPlayerHealth, 2, initialTokens, zone, 0, picac, startingFocus, [playerSet.rgweapon[weaponIndex]]));
            index++;
        });
    });
    return rgplayer;
}

function Total(enemySet : EnemySet) : number {
    return enemySet.cNormal + enemySet.cDangerous + enemySet.cTough + enemySet.cScary;
}

const enemyNormal = (index: number, zone : number, isCritical : boolean) => new Combatant(index, 4, 1, initialTokens, zone, 0, isCritical, [NPCBasicAttack]);
const enemyDangerous = (index: number, zone : number, isCritical : boolean) => new Combatant(index, 8, 2, initialTokens, zone, 0, isCritical, [NPCBasicAttack]);
const enemyTough = (index: number, zone : number, isCritical : boolean) => new Combatant(index, 12, 2, initialTokens, zone, 0, isCritical, [NPCBasicAttack]);
const enemyScary = (index: number, zone : number, isCritical : boolean) => new Combatant(index, 16, 4, initialTokens, zone, 0, isCritical, [NPCBasicAttack]);

function rgEnemyByType(
    startingIndex : number,
    cenemy : number,
    fnEnemy : (index: number, zone : number, isCritical : boolean) => Combatant,
    zone : number,
    isCritical : boolean)
{
  let rgenemy = [];
  for(let i = 0; i < cenemy; i++)
    rgenemy.push(fnEnemy(startingIndex + i, zone, isCritical));
  
  return rgenemy;
}

export function rgEnemyFromEnemySet(i : number, enemySet : EnemySet, zone : number, isCritical : boolean) {
    let rgenemy : Combatant[] = [];
    let startingIndex = i;
    rgenemy = rgenemy.concat(rgEnemyByType(startingIndex, enemySet.cNormal, enemyNormal, zone, isCritical));
    startingIndex += enemySet.cNormal;
    rgenemy = rgenemy.concat(rgEnemyByType(startingIndex, enemySet.cDangerous, enemyDangerous, zone, isCritical));
    startingIndex += enemySet.cDangerous;
    rgenemy = rgenemy.concat(rgEnemyByType(startingIndex, enemySet.cTough, enemyTough, zone, isCritical));
    startingIndex += enemySet.cTough;
    rgenemy = rgenemy.concat(rgEnemyByType(startingIndex, enemySet.cScary, enemyScary, zone, isCritical));
    return rgenemy;
}

export function InitialStateFromScenario(scenario : CombatScenario) : GameState {
    let rgplayer = rgplayerFromPlayerSetByZone(scenario.playerSetByZone, scenario.startingFocus);
    
    let npcIndex = 0;
    let rgenemy : Combatant[] = [];
    scenario.enemySetPrimaryByZone.forEach((enemySetPrimary : EnemySet, zone : number) => {
        rgenemy = rgenemy.concat(rgEnemyFromEnemySet(npcIndex, enemySetPrimary, zone, true /* primary enemies are critical */));
        npcIndex += Total(enemySetPrimary);
    });
    scenario.enemySetSecondaryByZone.forEach((enemySetSecondary : EnemySet, zone : number) => {
        rgenemy = rgenemy.concat(rgEnemyFromEnemySet(npcIndex, enemySetSecondary, zone, false /* secondary enemies are not */));
        npcIndex += Total(enemySetSecondary);
    });
    return new GameState(rgplayer, rgenemy, scenario.map);
}