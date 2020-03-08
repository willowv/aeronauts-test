import Combatant, { Ability, Token, Boost, Component } from './combatant'
import { Character } from './character';

const playerHealth = 15;

export class Player extends Character {
    abilityScores : number[];
    focus: number;

    constructor(actions: number, picac : number[], focus: number) {
        super(playerHealth, actions, true /* players are always critical */);
        this.abilityScores = [...picac];
        this.focus = focus;
    }

    act(rgplayer : Combatant[], rgenemy : Combatant[]) : number {
        // Temporary AI
        let rgenemyTarget = rgenemy
            .filter((enemy) => !enemy.isDead() && enemy.isCritical()) // only target living, primary enemies
            .sort((a, b) => a.health[0] - b.health[0]); // attack lowest health enemy
        
        if(rgenemyTarget.length === 0)
            return 0; // No enemy to target
        
        let target = 0;
        for(let action = 0; action < this.actions; action++)
        {
            let enemy = rgenemyTarget[target];
            let checkResult = this.actionCheck(
                Ability.Coordination,
                this.getBoost(Token.Action) - enemy.getBoost(Token.Defense)); // need to handle attacking airships, using different stats
            
            if(checkResult >= 15)
                enemy.takeDamage(5, 0);

            else if (checkResult >= 10)
                enemy.takeDamage(3, 0);

            if(enemy.isDead())
            {
                target++;
                if(target >= rgenemyTarget.length)
                    return action + 1; // No enemy to target
            }
        }
        return this.actions;
    }

    defend(ability: Ability, token : Token, attackerBoost: number) : number {
        return this.defenseCheck(ability, this.getBoost(token) - attackerBoost);
    }

    takeDamage(damage: number, component : Component) {
        if(component != Component.None)
            throw new Error("Character cannot take ship component damage.");

        let health = this.getHealth();
        if(health > 10 && health - damage <= 10)
            this.tokens[Token.Action][Boost.Negative]++;

        if(health > 5 && health - damage <= 5)
            this.tokens[Token.Action][Boost.Negative]++;

        this.setHealth(health - damage);
    }

    actionCheck(ability : Ability, boost : number) : number {
        let modifier = this.abilityScores[ability];
        if(this.focus > 0) {
            modifier++;
            this.focus--;
        }
        return rollDice(modifier, boost);
    }

    defenseCheck(ability : Ability, boost : number) : number {
        let modifier = this.abilityScores[ability];
        if(this.focus > 0) {
            modifier++;
            this.focus--;
        }
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