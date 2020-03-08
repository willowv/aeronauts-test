import { Combatant, Token, Ability, Component } from "./combatant";
import { Enemy } from "./enemy";

export class EnemyAirship extends Combatant {
    rgcomponent : Enemy[] = [];

    constructor(rgcomponent : Enemy[]) {
        super(rgcomponent.map((component : Enemy) => component.getHealth()), 0, false); // the enemy ship is not critical but its components might be
        rgcomponent = [...rgcomponent];
    }

    act(rgplayer: Combatant[], rgenemy: Combatant[]): number {
        let actionCount = 0;
        this.rgcomponent.forEach((component : Enemy) => {
            if(!component.isDead())
                actionCount += component.act(rgplayer, rgenemy);
        });
        return actionCount;
    }

    takeDamage(damage: number, component: number): void {
        this.rgcomponent[component].takeDamage(damage, Component.None);
    }

    isDead(): boolean {
        let isDead = true;
        this.rgcomponent.forEach((component : Enemy) => {
            if(!component.isDead())
                isDead = false;
        });
        return isDead;
    }

    isCritical() : boolean {
        let isCritical = false;
        this.rgcomponent.forEach((component : Enemy) => {
            if(component.isCritical() && !component.isDead())
                isCritical = true;
        });
        return isCritical;
    }

    defend(ability: Ability, token: Token, attackerBoost: number): number {
        throw new Error("Method not implemented.");
    }
}