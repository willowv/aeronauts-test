import Combatant, { initialTokens } from "./combatant";

export const initialPlayerHealth = 15;

export class Player extends Combatant {
    abilityScores : number[];
    focus: number;

    constructor(index : number, health : number, actions: number, tokens : number[][], zone : number, actionsTaken : number, picac : number[], focus: number) {
        super(index, health, actions, tokens, zone, actionsTaken, true /* players are always critical */);
        this.abilityScores = [...picac];
        this.focus = focus;
    }

    clone() : Player {
        return new Player(this.index, this.health, this.actions, this.tokens, this.zone, this.actionsTaken, this.abilityScores, this.focus);
    }
}