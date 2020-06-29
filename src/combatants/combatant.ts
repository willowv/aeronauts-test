import { Token, Ability, Boost } from "../simulator/enum";

export const initialTokens = [[0,0],[0,0]];

export class Combatant {
    index : number;
    health: number;
    actions: number;
    tokens : number[][];
    zone : number;
    actionsTaken : number;
    isCritical : boolean;

    constructor(index: number, health : number, actions : number, tokens : number[][], zone: number, actionsTaken : number, isCritical : boolean) {
        this.index = index;
        this.health = health;
        this.actions = actions;
        this.tokens = tokens;
        this.zone = zone;
        this.actionsTaken = actionsTaken;
        this.isCritical = isCritical;
    }

    isDead() : boolean {
        return this.health <= 0;
    }

    clone() : Combatant {
        return new Combatant(this.index, this.health, this.actions, this.tokens, this.zone, this.actionsTaken, this.isCritical);
    }
}
export default Combatant;