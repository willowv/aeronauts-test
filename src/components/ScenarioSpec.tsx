import React from 'react';
import { Box, Flex, Heading, Card } from 'rebass';
import { EnemySet, PlayerStub, EmptyES } from '../simulator/scenario';
import { TerrainExposed, TerrainDefault } from '../map/terrain';
import { GameMap } from '../map/map';
import { Player } from '../combatants/player';
import { ZoneSpec } from './zoneSpec';
import { Pistol } from '../combatants/actions/playerActions';
import { PlayerSpec } from './PlayerSpec';
import { MapVis } from './MapVis';

// Player specs across the top, w/ plus button for adding more players
// Zone layout/connections on the left
// Zone spec on the right for the selected zone

interface ScenarioSpecState {
  players : PlayerStub[];
  npcSetsByZone : EnemySet[];
  map : GameMap;
  selectedZone : number;
}

export class ScenarioSpec extends React.Component<any, ScenarioSpecState> {
  constructor(props: any){
    super(props);
    this.state = {
      players: [new PlayerStub([0, 1, 1, 0, 2], Pistol, "Captain", 0)],
      npcSetsByZone: [EmptyES, EmptyES, EmptyES, EmptyES],
      map: new GameMap(
        [TerrainDefault, TerrainDefault, TerrainDefault, TerrainDefault],
        [[false, true, true, false],
        [true, false, false, true],
        [true, false, false, true],
        [false, true, true, false]]),
      selectedZone : 0
    };
  }

  render() {
    let playerSpecs = this.state.players.map((player) => 
      (<PlayerSpec
        abilityScores={player.abilityScores}
        weapon={player.weapon}
        name={player.name}
        zone={player.zone}
        zonesAvailable={this.state.map.terrain.length}
      />));
    return (
      <Box
        sx={{
          p: 4,
          color: 'text',
          bg: 'background',
          fontFamily: 'body',
          fontWeight: 'body',
          lineHeight: 'body',
        }}>
          <Flex>
            {playerSpecs}
            <Card
              sx={{bg: 'primary', color:'white', width: 350, height: 200, p: 2, m:2, borderRadius: 2, boxShadow: '0 0 16px rgba(0, 0, 0, .25)'}}>
                <Heading as='h3' textAlign='center' verticalAlign='middle'>+</Heading>
            </Card>
          </Flex>
          <Flex>
            <Box
              flex='1 1 auto'
              sx={{p: 2, m:2, borderRadius: 2, boxShadow: '0 0 16px rgba(0, 0, 0, .25)'}}
            >
              <MapVis
                map={this.state.map}
                players={this.state.players}
                enemySetByZone={this.state.npcSetsByZone}
                selectedZone={this.state.selectedZone}
                setSelectedZone={(zone : number) => {
                  this.setState({selectedZone: zone});
                }}
              />
            </Box>
            <ZoneSpec
              zone={this.state.selectedZone}
              npcs={this.state.npcSetsByZone[this.state.selectedZone]}
              terrain={this.state.map.terrain[this.state.selectedZone]}
              handleNpcsChange={(newNpcSet) => {
                this.setState((state : ScenarioSpecState) => {
                  let newNpcSetsByZone = state.npcSetsByZone.map((npcSet) => npcSet.clone());
                  newNpcSetsByZone[state.selectedZone] = newNpcSet;
                  return { npcSetsByZone: newNpcSetsByZone };
                })
              }}
              handleTerrainChange={(newTerrain) => {
                this.setState((state : ScenarioSpecState) => {
                  let newMap = state.map.clone();
                  newMap.terrain[state.selectedZone] = newTerrain;
                  return { map: newMap };
                })
              }}
            />
          </Flex>
        </Box>
    );
  }
}
