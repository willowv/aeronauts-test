export enum Token {
    Action = 0,
    Defense,
    Cannons,
    Torpedoes,
    Engines,
    AntiAir
}

export enum Boost {
    Positive = 0,
    Negative
}

export enum Component {
    None = 0,
    Cannons,
    Torpedoes,
    Engines,
    AntiAir
}

export enum Ability {
    Perception = 0,
    Intelligence,
    Coordination,
    Agility,
    Conviction
}

export abstract class Combatant {
    health: number[];
    actions: number;

    // tokens
    tokens : number[][] = [];

    constructor(health : number[], actions : number) {
        this.health = health;
        this.actions = actions;
        this.tokens[Token.Action] = [0,0];
        this.tokens[Token.Defense] = [0,0];
    }

    abstract act(rgplayer : Combatant[], rgenemyPrimary : Combatant[], rgenemySecondary : Combatant[]) : number

    abstract defend(ability : Ability, token : Token, attackerBoost : number) : number

    abstract takeDamage(damage : number, component : Component) : void

    abstract isDead() : boolean

    getBoost(tokenType : Token) {
        let boost = 0;
        if(this.tokens[tokenType][Boost.Positive] > 0) {
            boost++;
            this.tokens[tokenType][Boost.Positive]--;
        }
        if(this.tokens[tokenType][Boost.Negative] > 0) {
            boost--;
            this.tokens[tokenType][Boost.Negative]--;
        }
        return boost;
    }
}
export default Combatant;