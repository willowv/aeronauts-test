import { Player } from "../combatants/player";
import { Ability, Token, Boost } from "../combatants/combatant";

export const AttemptShortcut = (player : Player, ability : Ability, token : Token) => {
    let checkResult = player.actionCheck(ability, player.getBoost(token));
    if(checkResult < 10)
        return false;

    else if (checkResult < 15){
        player.tokens[Token.Action][Boost.Negative] += 1;
        player.tokens[Token.Defense][Boost.Negative] += 1;
    }
    return true;
}