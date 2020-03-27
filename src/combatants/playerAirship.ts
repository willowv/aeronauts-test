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
        super(health, 0, true);
        this.captain = captain;
        this.engineer = engineer;

        // Add ship token types
        this.tokens[Token.Cannons] = [0,0];
        this.tokens[Token.Torpedoes] = [0,0];
        this.tokens[Token.Engines] = [0,0];
        this.tokens[Token.AntiAir] = [0,0];
    }

    act(rgplayer : Combatant[], rgenemy : Combatant[]) : number {
        return this.captain.act(rgplayer, rgenemy) +
            this.engineer.act(rgplayer, rgenemy); // need to handle the captain and the engineer being aware of the ship and its tokens
    }

    defend(ability : Ability, token : Token, attackerBoost : number) : number {
        let defenderBoost = -1; // When component is down, always negative boost
        switch(token) {
            case Token.AntiAir:
                if(this.health[Component.AntiAir] > 0)
                    defenderBoost = this.getBoost(token);

                return this.captain.defenseCheck(ability, defenderBoost - attackerBoost);
            
            case Token.Engines:
                if(this.health[Component.Engines] > 0)
                    defenderBoost = this.getBoost(token);

                return this.engineer.defenseCheck(ability, defenderBoost - attackerBoost);

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