export abstract class Combatant {
    health: {[component : string] : number};
    actions: number;

    // tokens
    tokens : { [type : string] : number[] } = {
        'action': [0,0],
        'defense': [0,0]
    }

    constructor(health : {[component : string] : number}, actions : number) {
        this.health = health;
        this.actions = actions;
    }

    abstract act(rgplayer : Combatant[], rgenemyPrimary : Combatant[], rgenemySecondary : Combatant[]) : number

    abstract defend(ability : string, attacker : Combatant) : number

    abstract takeDamage(damage : number, component : string) : void

    abstract isDead() : boolean

    getBoost(tokenType : string) {
        let boost = 0;
        if(this.tokens[tokenType][0] > 0) {
            boost++;
            this.tokens[tokenType][0]--;
        }
        if(this.tokens[tokenType][1] > 0) {
            boost--;
            this.tokens[tokenType][1]--;
        }
        return boost;
    }
}
export default Combatant;