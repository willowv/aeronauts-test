import Combatant from './combatant'

const playerHealth = 15;

export class Player extends Combatant {
    abilityScores : { [ability : string] : number };
    focus: number;

    constructor(actions: number, picac : number[], focus: number) {
        super(playerHealth, actions);
        this.abilityScores = {
            'per' : picac[0],
            'int' : picac[1],
            'coord' : picac[2],
            'agi' : picac[3],
            'conv' : picac[4]
        }
        this.focus = focus;
    }

    act(rgplayer : Combatant[], rgenemyPrimary : Combatant[], rgenemySecondary : Combatant[]) : void {
        // Select target - for now, choose the lowest health enemy in Primary
        let rgenemyPrimarySorted = [...rgenemyPrimary].sort((a, b) => a.health - b.health);
        
        let target = 0;
        for(let action = 0; action < this.actions; action++)
        {
            let enemy = rgenemyPrimarySorted[target];
            let checkResult = this.actionCheck('coord', enemy);
            if(checkResult >= 15)
                enemy.takeDamage(5);

            else if (checkResult >= 10)
                enemy.takeDamage(3);

            if(enemy.isDead())
                target++;
        }
    }

    defend(ability: string, attacker: Combatant) : number {
        return this.defenseCheck(ability, attacker);
    }

    takeDamage(damage: number) {
        if(this.health > 10 && this.health - damage <= 10)
            this.disadv += 1;

        if(this.health > 5 && this.health - damage <= 5)
            this.disadv += 1;

        this.health -= damage;
    }

    actionCheck(ability : string, enemy : Combatant) : number {
        let modifier = this.abilityScores[ability];
        if(this.focus > 0) {
            modifier++;
            this.focus--;
        }
        let boost = this.actionBoost() - enemy.defenseBoost();
        return rollDice(modifier, boost);
    }

    defenseCheck(ability : string, enemy : Combatant) : number {
        let modifier = this.abilityScores[ability];
        if(this.focus > 0) {
            modifier++;
            this.focus--;
        }
        let boost = this.defenseBoost() - enemy.actionBoost();
        return rollDice(modifier, boost);
    }
}

export function rollDice(modifier : number, boost : number) : number {
    let d6 = 3 + Math.abs(boost);
    let rolls = Array(d6);
    for(let i = 0; i < d6; i++) {
        rolls[i] = Math.floor(Math.random() * 6 + 1);
    }
    let rollsSorted = rolls.sort();
    if(boost > 0) {
        rollsSorted = rollsSorted.reverse(); // get highest three if boost is positive
    }
    return rollsSorted[0] + rollsSorted[1] + rollsSorted[2] + modifier;
}

export interface PlayerSet {
    rgpicac : number[][];
}

export function rgplayerFromPlayerSet(playerSet : PlayerSet, actions : number, startingFocus : number) {
    let rgplayer : Player[] = [];
    playerSet.rgpicac.forEach((picac : number[]) => {
        rgplayer.push(new Player(actions, picac, startingFocus));
    })
    return rgplayer;
}