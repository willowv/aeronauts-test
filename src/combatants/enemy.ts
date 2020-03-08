import Combatant, { Ability, Token, Component } from './combatant'
import { Character } from './character';

export class Enemy extends Character{
    constructor(health: number, actions: number) {
        super(health, actions);
    }

    act(rgplayer : Combatant[], rgenemyPrimary : Combatant[], rgenemySecondary : Combatant[]) : number {
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

const enemyNormal = (baseActions : number) => new Enemy(4, Math.ceil(baseActions/2));
const enemyDangerous = (baseActions : number) => new Enemy(8, Math.ceil(baseActions));
const enemyTough = (baseActions : number) => new Enemy(12, Math.ceil(baseActions));
const enemyScary = (baseActions : number) => new Enemy(16, Math.ceil(baseActions*2));

function rgEnemyByType(cenemy : number, fnEnemy : (baseActions : number) => Enemy, baseActions : number)
{
  let rgenemy = [];
  for(let i = 0; i < cenemy; i++)
    rgenemy.push(fnEnemy(baseActions));
  
  return rgenemy;
}

export function rgEnemyFromEnemySet(enemySet : EnemySet, baseActions : number) {
    let rgenemy : Enemy[] = [];
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cNormal, enemyNormal, baseActions));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cDangerous, enemyDangerous, baseActions));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cTough, enemyTough, baseActions));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cScary, enemyScary, baseActions));
    return rgenemy;
}