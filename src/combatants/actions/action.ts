import { Attack, Ability} from "../../enum";
import Combatant from "../combatant";
import { GameState } from "../../simulator/state";

export class Action {
    minRange : number;
    maxRange : number;
    type : Attack;
    ability: Ability;
    evaluate : (checkResult : number, actor : Combatant, target : Combatant, state : GameState) => void;
  
    constructor(
      minRange : number,
      maxRange : number,
      type : Attack,
      ability : Ability,
      evaluate : (checkResult : number, actor : Combatant, target : Combatant, state : GameState) => void) {
      this.minRange = minRange;
      this.maxRange = maxRange;
      this.type = type;
      this.ability = ability;
      this.evaluate = evaluate;
    }
}