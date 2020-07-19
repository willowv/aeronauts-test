import { AttackType, Ability, Faction } from "../../../enum";
import { Action } from "./action";

export const EnemyBasicAttack = new Action(
  "Enemy Basic Attack",
  0,
  1,
  AttackType.Ranged,
  Ability.Agility,
  10,
  15,
  Faction.Players,
  (checkResult, actor, target, state) => {
    if (checkResult < 10) {
      target.health -= 5;
    } else if (checkResult < 15) {
      target.health -= 2;
    }
  }
);
