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

    takeDamage(damage : number) : void {
        this.health -= damage;
    }

    isDead() {
        return this.health <= 0;
    }
}
export default Combatant;