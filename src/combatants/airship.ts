import Combatant from "./combatant";
import { Player } from "./player";

export class PlayerAirship extends Combatant {
    captain : Player;
    engineer: Player;

    constructor(captain : Player, engineer : Player) {
        super({
            'cannons': 15,
            'torpedoes': 15,
            'engines': 15,
            'antiAir': 15
        }, 0);
        this.captain = captain;
        this.engineer = engineer;

        // Add ship token types
        this.tokens['cannon'] = [0,0];
        this.tokens['torpedo'] = [0,0];
        this.tokens['engines'] = [0,0];
        this.tokens['antiAir'] = [0,0];
    }

    act(rgplayer : Combatant[], rgenemyPrimary : Combatant[], rgenemySecondary : Combatant[]) : number {
        return this.captain.act(rgplayer, rgenemyPrimary, rgenemySecondary) +
            this.engineer.act(rgplayer, rgenemyPrimary, rgenemySecondary);
     }

    defend(ability : string, attacker : Combatant) : number {
        switch(ability) {
            case 'antiAir':
                return this.captain.defenseCheck('per', this.getBoost(ability));
            
            case 'engines':
                return this.engineer.defenseCheck('coord', this.getBoost(ability));

            default:
                return this.captain.defenseCheck(ability, this.getBoost('engines'));
        }
    }

    takeDamage(damage : number, component : string) : void {
        if(this.health[component] > 10 && this.health[component] - damage <= 10)
            this.tokens[component][1]++;

        if(this.health[component] > 5 && this.health[component] - damage <= 5)
            this.tokens[component][1]++;

        this.health[component] -= damage;
    }

    isDead(): boolean {
        let isDead = true;
        for (let component in this.health) {
            if(this.health[component] > 0)
                isDead = false;
        }
        return isDead;
    }
}