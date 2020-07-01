import React from 'react';
import { Box } from 'rebass';
import { EnemySet, PlayerStub, EmptyES } from '../simulator/scenario';
import { TerrainExposed, TerrainDefault } from '../map/terrain';
import { GameMap } from '../map/map';
import { Player } from '../combatants/player';
import { ZoneSpec } from './zoneSpec';

// Player specs across the top, w/ plus button for adding more players
// Zone layout/connections on the left
// Zone spec on the right for the selected zone

interface ScenarioSpecState {
  playersByZone : PlayerStub[][];
  npcSetsByZone : EnemySet[];
  map : GameMap;
  selectedZone : number;
}

export class ScenarioSpec extends React.Component<any, ScenarioSpecState> {
  constructor(props: any){
    super(props);
    this.state = {
      playersByZone: [[]],
      npcSetsByZone: [EmptyES],
      map: new GameMap([TerrainDefault], [[true]]),
      selectedZone : 0
    };
  }

  render() {
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
          < ZoneSpec
            zone={this.state.selectedZone}
            players={this.state.playersByZone[this.state.selectedZone]}
            npcs={this.state.npcSetsByZone[this.state.selectedZone]}
            terrain={this.state.map.terrain[this.state.selectedZone]}
            zonesConnectedTo={this.state.map.ZonesMovableFrom(this.state.selectedZone)}
          />
        </Box>
    );
  }
}
