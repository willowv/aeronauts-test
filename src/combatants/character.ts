import { Combatant, Component } from "./combatant";

export abstract class Character extends Combatant {
    constructor(health : number, actions: number, isCritical : boolean) {
        super([health], actions, isCritical);
    }

    isDead() : boolean {
        return this.health[Component.None] <= 0;
    }

    getHealth() : number { return this.health[Component.None]; }
    setHealth(health : number) : void { this.health[Component.None] = health; }
}