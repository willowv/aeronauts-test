import Combatant, { Token, Component, Ability, Boost } from "./combatant";
import { Player } from "./player";



export class PlayerAirship extends Combatant {
    captain : Player;
    engineer: Player;

    constructor(captain : Player, engineer : Player) {
        let health : number[] = [];
        health[Component.Cannons] = 15;
        health[Component.Torpedoes] = 15;
        health[Component.Engines] = 15;
        health[Component.AntiAir] = 15;
        super(health, 0);
        this.captain = captain;
        this.engineer = engineer;

        // Add ship token types
        this.tokens[Token.Cannons] = [0,0];
        this.tokens[Token.Torpedoes] = [0,0];
        this.tokens[Token.Engines] = [0,0];
        this.tokens[Token.AntiAir] = [0,0];
    }

    act(rgplayer : Combatant[], rgenemyPrimary : Combatant[], rgenemySecondary : Combatant[]) : number {
        return this.captain.act(rgplayer, rgenemyPrimary, rgenemySecondary) +
            this.engineer.act(rgplayer, rgenemyPrimary, rgenemySecondary);
    }

    defend(ability : Ability, token : Token, attackerBoost : number) : number {
        switch(token) {
            case Token.AntiAir:
                return this.captain.defenseCheck(ability, this.getBoost(token) - attackerBoost);
            
            case Token.Engines:
                return this.engineer.defenseCheck(ability, this.getBoost(token) - attackerBoost);

            default:
                return this.captain.defenseCheck(ability, this.captain.getBoost(token) - attackerBoost);
        }
    }

    takeDamage(damage : number, component : Component) : void {
        if(component == Component.None)
            throw new Error("Ship damage must include a component.");

        if(this.health[component] > 10 && this.health[component] - damage <= 10)
            this.tokens[component][Boost.Negative]++;

        if(this.health[component] > 5 && this.health[component] - damage <= 5)
            this.tokens[component][Boost.Negative]++;

        this.health[component] -= damage;
    }

    isDead(): boolean {
        let isDead = true;
        this.health.forEach((componentHealth : number) => {
            if(componentHealth > 0)
                isDead = false;
        });
        return isDead;
    }
}