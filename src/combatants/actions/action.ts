import { Attack, Ability} from "../../enum";
import Combatant from "../combatant";
import { GameState } from "../../simulator/state";

export class Action {
    name : string;
    minRange : number;
    maxRange : number;
    type : Attack;
    ability: Ability;
    evaluate : (checkResult : number, actor : Combatant, target : Combatant, state : GameState) => void;
  
    constructor(
      name : string,
      minRange : number,
      maxRange : number,
      type : Attack,
      ability : Ability,
      evaluate : (checkResult : number, actor : Combatant, target : Combatant, state : GameState) => void) {
        this.name = name;
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.type = type;
        this.ability = ability;
        this.evaluate = evaluate;
    }
}