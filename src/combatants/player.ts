import Combatant, { initialTokens } from "./combatant";

export const initialPlayerHealth = 15;

export class Player extends Combatant {
    abilityScores : number[];
    focus: number;

    constructor(health : number, actions: number, tokens : number[][], zone : number, actionsTaken : number, picac : number[], focus: number) {
        super(health, actions, tokens, zone, actionsTaken, true /* players are always critical */);
        this.abilityScores = [...picac];
        this.focus = focus;
    }
}

export const TestPC : Player = new Player(initialPlayerHealth, 2, initialTokens, 0, 0, [1, 0, 1, 1, 1], 12);