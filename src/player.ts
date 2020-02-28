import Combatant from './combatant'

const playerHealth = 15;

export class Player extends Combatant {
    // ability scores
    per: number;
    int: number;
    coord: number;
    agi: number;
    conv: number;

    focus: number;

    constructor(actions: number, picac : number[], focus: number) {
        super(playerHealth, actions);
        this.per = picac[0];
        this.int = picac[1];
        this.coord = picac[2];
        this.agi = picac[3];
        this.conv = picac[4];
        this.focus = focus;
    }

    act(rgplayer : Combatant[], rgenemyPrimary : Combatant[], rgenemySecondary : Combatant[]) : void {
        /*if(rgenemyPrimary.length == 0)
            return 0;
        
        let iPlayerTarget = 0;
        let iPlayerTargetSecondary = -1;
        let actPlayerRemaining = actPlayerOutput;
        while(actPlayerRemaining > 0)
        {
            if(rgenemyPrimary.length == 0)
            return actPlayerOutput - actPlayerRemaining;
            
            iPlayerTarget = iPlayerTarget % (rgenemyPrimary.length + rgenemySecondary.length);
            iPlayerTargetSecondary = iPlayerTarget - rgenemyPrimary.length;
            if(iPlayerTargetSecondary >= 0)
            DamageAndKill(rgenemySecondary, iPlayerTargetSecondary);
            else
            DamageAndKill(rgenemyPrimary, iPlayerTarget);
            
            actPlayerRemaining--;
            iPlayerTarget = (iPlayerTarget + 1) % cPlayerTargets;
        }*/
        console.log("Player took an action.");
    }

    takeDamage(damage: number) {
        if(this.health > 10 && this.health - damage <= 10)
            this.disadv += 1;

        if(this.health > 5 && this.health - damage <= 5)
            this.disadv += 1;

        this.health -= damage;
    }
}

export interface PlayerSet {
    rgpicac : number[][];
}

export function rgplayerFromPlayerSet(playerSet : PlayerSet, actions : number, startingFocus : number) {
    let rgplayer : Player[] = [];
    playerSet.rgpicac.forEach((picac : number[]) => {
        rgplayer.push(new Player(actions, picac, startingFocus));
    })
    return rgplayer;
}