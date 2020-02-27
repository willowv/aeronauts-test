import { Enemy } from './enemy'
import { EnemySet } from './enemy'
import { rgEnemyFromEnemySet } from './enemy'

const expectedDamagePlayer = 3;
const expectedDamageEnemy = 2;

// Given number of each type of enemy, number of players, assumed focus percentage, and who goes first
// Return number of total actions and number of threat actions
export function SimulateCombat(enemySetPrimary : EnemySet, enemySetSecondary : EnemySet, cPlayers : number, cPlayerTargets : number, fPlayersFirst : boolean)
{
  let actTotal = 0;
  let actEnemy = 0;
  let rgenemyPrimary = rgEnemyFromEnemySet(enemySetPrimary);
  let rgenemySecondary = rgEnemyFromEnemySet(enemySetSecondary);
  
  // Combat
  if(!fPlayersFirst)
    actEnemy += cPlayers;

  while(rgenemyPrimary.length > 0)
  {
    actTotal += PlayersAttack(rgenemyPrimary, rgenemySecondary, 2 * cPlayers, cPlayerTargets);
    let actThreat = EnemiesAttack(rgenemyPrimary) + EnemiesAttack(rgenemySecondary);
    actTotal += actThreat;
    actEnemy += actThreat;
  }
  
  return [actTotal, actEnemy];
}

function PlayersAttack(rgenemyPrimary : Enemy[], rgenemySecondary : Enemy[], actPlayerOutput : number, cPlayerTargets : number)
{
  if(rgenemyPrimary.length == 0)
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
  }
  return actPlayerOutput;
}

function DamageAndKill(rgenemy : Enemy[], ienemyTarget: number)
{
  if(ienemyTarget >= rgenemy.length)
    return;
    
  rgenemy[ienemyTarget].takeDamage(expectedDamagePlayer);
  if(rgenemy[ienemyTarget].isDead())
    rgenemy.splice(ienemyTarget, 1);
}

function EnemiesAttack(rgenemy : Enemy[])
{
  let actThreat = 0;
  if(rgenemy.length == 0)
    return 0;
  
  rgenemy.forEach((enemy) => actThreat += enemy.dealDamage());
  return actThreat;
}