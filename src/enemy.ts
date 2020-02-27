export class Enemy {
    health: number;
    actions: number;

    constructor(health: number, actions: number) {
        this.health = health;
        this.actions = actions;
    }

    takeDamage(damage: number) {
        this.health -= damage;
        if(this.health < 0 )
            return -this.health;

        return 0;
    }

    dealDamage() {
        return this.actions;
    }

    isDead() {
        return this.health <= 0;
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