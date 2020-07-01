import { Attack, Ability, Token, Boost } from "../../enum";
import { Action } from "./action";

export const Pistol = new Action(0, 1, Attack.Ranged, Ability.Coordination, (checkResult, actor, target, state) => {
    if(checkResult >= 15) {
      target.health -= 4;
      actor.tokens[Token.Action][Boost.Positive] += 2;
    } else if (checkResult >= 9) {
      target.health -= 2;
    }
  });
  
  export const Shotgun = new Action(0, 1, Attack.Ranged, Ability.Coordination, (checkResult, actor, target, state) => {
    if(checkResult >= 13) {
      target.health -= 3;
      // push into first zone that is further away that target, if any
      let pushableZones = state.map.ZonesMovableFrom(target.zone).filter((zone : number) => {
        return zone != actor.zone;
      });
      if(pushableZones.length != 0)
        target.zone = pushableZones[0];
    } else if (checkResult >= 11) {
      target.health -= 3;
    }
  });
  
  export const Rifle = new Action(1, Infinity, Attack.Ranged, Ability.Coordination, (checkResult, actor, target, state) => {
    if(checkResult >= 17) {
      target.health -= 5;
      // grant an ally a move (TODO: needs decision logic, which takes in a set of potential states and returns the index of the best one)
    } else if (checkResult >= 12) {
      target.health -= 4;
    }
  });
  
  export const LightMelee = new Action(0, 0, Attack.Melee, Ability.Coordination, (checkResult, actor, target, state) => {
    if(checkResult >= 16) {
      target.health -=6;
      target.tokens[Token.Defense][Boost.Negative] += 2;
    } else if (checkResult >= 9) {
      target.health -= 2;
    }
  });
  
  export const MediumMelee = new Action(0, 0, Attack.Melee, Ability.Coordination, (checkResult, actor, target, state) => {
    if(checkResult >= 16) {
      target.health -= 5;
      target.tokens[Token.Action][Boost.Negative] += 2;
    } else if (checkResult >= 10) {
      target.health -= 3;
    }
  });
  
  export const HeavyMelee = new Action(0, 0, Attack.Melee, Ability.Coordination, (checkResult, actor, target, state) => {
    if(checkResult >= 15) {
      target.health -= 6;
    } else if (checkResult >= 12) {
      target.health -= 4;
    }
  });