import React from 'react';
import { Box, Flex, Heading, Card, Button } from 'rebass';
import { EnemySet, PlayerStub, EmptyES, CombatScenario } from '../simulator/scenario';
import { TerrainExposed, TerrainDefault, TerrainCover } from '../map/terrain';
import { GameMap } from '../map/map';
import { Player } from '../combatants/player';
import { ZoneSpec } from './zoneSpec';
import { Pistol, Shotgun, HeavyMelee } from '../combatants/actions/playerActions';
import { PlayerSpec } from './PlayerSpec';
import { MapVis } from './MapVis';
import { StatsVis } from './StatsVis';
import { ScenarioReport, SimulateScenario } from '../simulator/simulator';

// Player specs across the top, w/ plus button for adding more players
// Zone layout/connections on the left
// Zone spec on the right for the selected zone

interface ScenarioSpecState {
  players : PlayerStub[];
  npcSetsByZone : EnemySet[];
  map : GameMap;
  selectedZone : number;
  reports : ScenarioReport[];
}

export class ScenarioSpec extends React.Component<any, ScenarioSpecState> {
  constructor(props: any){
    super(props);
    this.state = {
      players: [
        new PlayerStub([0, 1, 1, 0, 2], Shotgun, "Captain", 0),
        new PlayerStub([1, 2, 0, 1, 0], Pistol, "Engineer", 0),
        new PlayerStub([0, 0, 2, 1, 1], HeavyMelee, "Strongman", 0)],
      npcSetsByZone: [EmptyES, new EnemySet(2,0,0,0), new EnemySet(2,0,0,0), new EnemySet(0,0,1,0)],
      map: new GameMap(
        [TerrainDefault, TerrainDefault, TerrainDefault, TerrainCover],
        [[false, true, true, false],
        [true, false, false, true],
        [true, false, false, true],
        [false, true, true, false]]),
      selectedZone : 0,
      reports: []
    };
  }

  render() {
    let playerSpecs = this.state.players.map((player, index) => 
      (<PlayerSpec
        player={player}
        zonesAvailable={this.state.map.terrain.length}
        handlePlayerChange={(newPlayer) => {
          this.setState((state) => {
            let newPlayers = state.players.map((player) => player.clone());
            newPlayers[index] = newPlayer;
            return { players: newPlayers };
          });
        }}
        handlePlayerDelete={() => {
          this.setState((state) => {
            let newPlayers = state.players.map((player) => player.clone());
            newPlayers.splice(index);
            return { players: newPlayers };
          });
        }}
      />));
    if(this.state.players.length < 6) { // if we're under the max number of players, include the add player button
      playerSpecs.push(
      (<Button
        onClick={() => {
          let newPlayers = this.state.players.map((player) => player.clone());
          newPlayers.push(new PlayerStub([0,0,0,0,0], Pistol, "", 0));
          this.setState({players: newPlayers});
        }}
        sx={{bg: 'primary', color:'white', width: 175, height: 300, p: 2, m:2, borderRadius: 2, boxShadow: '0 0 16px rgba(0, 0, 0, .25)'}}>
          <Heading as='h3' textAlign='center' verticalAlign='middle'>Add Player</Heading>
      </Button>));
    }
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
          <Flex flexWrap='wrap'>
            {playerSpecs}
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
          <StatsVis
            reports={this.state.reports}
            triggerNewSimulation={() => {
              let newReport = SimulateScenario(new CombatScenario(this.state.npcSetsByZone, this.state.players, 12, this.state.map), 10000);
              this.setState((prevState) => {
                return { reports: prevState.reports.concat(newReport) }
              });
            }}
          />
        </Box>
    );
  }
}
