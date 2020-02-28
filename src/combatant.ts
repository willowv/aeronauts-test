export class Combatant {
    health: number;
    actions: number;

    // tokens
    adv : number = 0;
    disadv : number = 0;
    def : number = 0;
    exp : number = 0;

    constructor(health : number, actions : number) {
        this.health = health;
        this.actions = actions;
    }

    act(rgplayer : Combatant[], rgenemyPrimary : Combatant[], rgenemySecondary : Combatant[]) : void { }

    defend(ability : string, attacker : Combatant) : number { return 0; }

    takeDamage(damage : number) : void {
        this.health -= damage;
    }

    isDead() {
        return this.health <= 0;
    }

    actionBoost() {
        let boost = 0;
        if(this.adv > 0) {
            boost++;
            this.exp--;
        }
        if(this.disadv > 0) {
            boost--;
            this.def--;
        }
        return boost;
    }

    defenseBoost() {
        let boost = 0;
        if(this.def > 0) {
            boost++;
            this.def--;
        }
        if(this.exp > 0) {
            boost--;
            this.exp--;
        }
        return boost;
    }
}
export default Combatant;