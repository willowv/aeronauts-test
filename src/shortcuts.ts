import { Player } from "./combatants/player";
import { Ability, Token, Boost } from "./combatants/combatant";
import { Zone } from "./action";

export class Shortcut {
    entryCheck : (player : Player, ability : Ability, token : Token) => boolean; // make a check, is entry possible, possible side effects
    zone : Zone;

    constructor(
        entryCheck : (player : Player, ability : Ability, token : Token) => boolean,
        zone : Zone) {
            this.entryCheck = entryCheck;
            this.zone = zone;
        }
}

export const defaultEntryCheck = (player : Player, ability : Ability, token : Token) => {
    let checkResult = player.actionCheck(ability, player.getBoost(token));
    if(checkResult < 10)
        return false;

    else if (checkResult < 15){
        player.tokens[Token.Action][Boost.Negative] += 1;
        player.tokens[Token.Defense][Boost.Negative] += 1;
    }
    return true;
}