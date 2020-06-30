import { Attack, Ability } from "../../simulator/enum";
import { Action } from "./action";

export const NPCBasicAttack = new Action(0, 1, Attack.Ranged, Ability.Agility, (checkResult, actor, target, state) => {
    if(checkResult < 10) {
      target.health -= 5;
    } else if (checkResult < 15) {
      target.health -= 2;
    }
  });