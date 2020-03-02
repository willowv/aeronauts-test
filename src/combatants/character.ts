import Combatant from "./combatant";

export abstract class Character extends Combatant {
    constructor(health : number, actions: number) {
        super({'none': health}, actions);
    }

    isDead() : boolean {
        return this.health['none'] <= 0;
    }

    getHealth() : number { return this.health['none']; }
    setHealth(health : number) : void { this.health['none'] = health; }
}