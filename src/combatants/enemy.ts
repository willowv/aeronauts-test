import Combatant, { Ability, Token, Component } from './combatant'
import { Character } from './character';

export class Enemy extends Character{
    constructor(health: number, actions: number, isCritical: boolean) {
        super(health, actions, isCritical);
    }

    act(rgplayer : Combatant[], rgenemy : Combatant[]) : number {
        // Temporary AI
        let rgplayerTarget = rgplayer
            .filter((player) => !player.isDead()) // filter out dead players
            .sort((a, b) => b.health[0] - a.health[0]); // target player with the highest health

        if(rgplayerTarget.length === 0)
            return 0; // no players to target

        let target = 0;
        for(let action = 0; action < this.actions; action++)
        {
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
        }
        return this.actions;
    }

    defend(ability: Ability, token: Token, attackerBoost: number): number {
        throw new Error("Method not implemented.");
    }

    takeDamage(damage: number, component: number): void {
        if(component != Component.None)
            throw new Error("Character cannot take ship component damage.");
            
        this.setHealth(this.getHealth() - damage);
    }
}

export interface EnemySet {
    cNormal : number;
    cDangerous : number;
    cTough : number;
    cScary : number;
}

const enemyNormal = (baseActions : number, isCritical : boolean) => new Enemy(4, Math.ceil(baseActions/2), isCritical);
const enemyDangerous = (baseActions : number, isCritical : boolean) => new Enemy(8, Math.ceil(baseActions), isCritical);
const enemyTough = (baseActions : number, isCritical : boolean) => new Enemy(12, Math.ceil(baseActions), isCritical);
const enemyScary = (baseActions : number, isCritical : boolean) => new Enemy(16, Math.ceil(baseActions*2), isCritical);

export const TestNPC = enemyDangerous(2, true);

function rgEnemyByType(
    cenemy : number,
    fnEnemy : (baseActions : number, isCritical : boolean) => Enemy,
    baseActions : number,
    isCritical : boolean)
{
  let rgenemy = [];
  for(let i = 0; i < cenemy; i++)
    rgenemy.push(fnEnemy(baseActions, isCritical));
  
  return rgenemy;
}

export function rgEnemyFromEnemySet(enemySet : EnemySet, baseActions : number, isCritical : boolean) {
    let rgenemy : Enemy[] = [];
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cNormal, enemyNormal, baseActions, isCritical));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cDangerous, enemyDangerous, baseActions, isCritical));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cTough, enemyTough, baseActions, isCritical));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cScary, enemyScary, baseActions, isCritical));
    return rgenemy;
}