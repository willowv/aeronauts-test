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
    _isCritical : boolean;

    // tokens
    tokens : number[][] = [];

    constructor(health : number[], actions : number, isCritical : boolean) {
        this.health = health;
        this.actions = actions;
        this.tokens[Token.Action] = [0,0];
        this.tokens[Token.Defense] = [0,0];
        this._isCritical = isCritical;
    }

    abstract act(rgplayer : Combatant[], rgenemy : Combatant[]) : number

    abstract defend(ability : Ability, token : Token, attackerBoost : number) : number

    abstract takeDamage(damage : number, component : Component) : void

    abstract isDead() : boolean

    isCritical() : boolean {
        return this._isCritical;
    }

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