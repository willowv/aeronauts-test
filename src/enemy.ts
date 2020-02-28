import Combatant from './combatant'

export class Enemy extends Combatant{
    constructor(health: number, actions: number) {
        super(health, actions);
    }

    act(rgplayer : Combatant[], rgenemyPrimary : Combatant[], rgenemySecondary : Combatant[]) : void {
        // choose the player with the highest health for now
        let rgplayerSorted = [...rgplayer].sort((a, b) => b.health - a.health);

        let target = 0;
        for(let action = 0; action < this.actions; action++)
        {
            let player = rgplayerSorted[target];
            let checkResult = player.defend('agi', this);
            if(checkResult < 10)
                player.takeDamage(5);

            else if (checkResult < 15)
                player.takeDamage(2);

            if(player.isDead())
                target++;
        }
    }
}

export interface EnemySet {
    cNormal : number;
    cDangerous : number;
    cTough : number;
    cScary : number;
}

const enemyNormal = () => new Enemy(4, 1);
const enemyDangerous = () => new Enemy(8, 2);
const enemyTough = () => new Enemy(12, 2);
const enemyScary = () => new Enemy(16, 4);

function rgEnemyByType(cenemy : number, fnEnemy : () => Enemy)
{
  let rgenemy = [];
  for(let i = 0; i < cenemy; i++)
    rgenemy.push(fnEnemy());
  
  return rgenemy;
}

export function rgEnemyFromEnemySet(enemySet : EnemySet) {
    let rgenemy : Enemy[] = [];
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cNormal, enemyNormal));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cDangerous, enemyDangerous));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cTough, enemyTough));
    rgenemy = rgenemy.concat(rgEnemyByType(enemySet.cScary, enemyScary));
    return rgenemy;
}