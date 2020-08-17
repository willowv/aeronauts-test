import React from "react";
import { Box, Flex, Heading, Button } from "rebass";
import {
  ScenarioEnemySet,
  ScenarioPlayer,
  EmptyEnemySet,
  Scenario,
} from "../simulation/scenario";
import {
  TerrainDefault,
  TerrainCover,
  TerrainUneven,
  TerrainUnstable,
  TerrainExposed,
  TerrainVantage,
} from "../simulation/map/terrain";
import { CombatMap } from "../simulation/map/map";
import { ZoneSpec } from "./zoneSpec";
import {
  Pistol,
  Shotgun,
  HeavyMelee,
  LightMelee,
} from "../simulation/combatants/actions/playerActions";
import { PlayerSpec } from "./PlayerSpec";
import { MapVis } from "./MapVis";
import { StatsVis } from "./StatsVis";
import { SimulateScenario } from "../simulation/simulator";
import { ScenarioReport } from "../simulation/statistics";
import {
  maxPlayerHealth,
  maxPlayerFocus,
} from "../simulation/combatants/player";

// Player specs across the top, w/ plus button for adding more players
// Zone layout/connections on the left
// Zone spec on the right for the selected zone

interface ScenarioSpecState {
  players: ScenarioPlayer[];
  npcSetsByZone: ScenarioEnemySet[];
  map: CombatMap;
  selectedZone: number;
  reports: ScenarioReport[];
}

export class ScenarioSpec extends React.Component<any, ScenarioSpecState> {
  constructor(props: any) {
    super(props);
    this.state = {
      players: [
        new ScenarioPlayer(
          [1, 1, 0, 0, 2],
          Pistol,
          "Captain",
          0,
          maxPlayerFocus,
          maxPlayerHealth
        ),
        new ScenarioPlayer(
          [1, 2, 1, 0, 0],
          Shotgun,
          "Tinkerer",
          0,
          maxPlayerFocus,
          maxPlayerHealth
        ),
        new ScenarioPlayer(
          [0, 0, 1, 2, 1],
          Pistol,
          "Gunslinger",
          0,
          maxPlayerFocus,
          maxPlayerHealth
        ),
        new ScenarioPlayer(
          [1, 0, 2, 0, 1],
          HeavyMelee,
          "Muscle",
          0,
          maxPlayerFocus,
          maxPlayerHealth
        ),
        new ScenarioPlayer(
          [2, 0, 1, 1, 0],
          LightMelee,
          "Thief",
          0,
          maxPlayerFocus,
          maxPlayerHealth
        ),
      ],
      npcSetsByZone: [
        EmptyEnemySet(),
        EmptyEnemySet(),
        new ScenarioEnemySet([2, 0, 0, 0]),
        new ScenarioEnemySet([0, 0, 0, 1]),
        new ScenarioEnemySet([2, 0, 0, 0]),
        new ScenarioEnemySet([2, 0, 0, 0]),
        EmptyEnemySet(),
      ],
      map: new CombatMap(
        [
          TerrainCover,
          TerrainUneven,
          TerrainExposed,
          TerrainUnstable,
          TerrainDefault,
          TerrainDefault,
          TerrainVantage,
        ],
        [
          [false, true, true, false, true, false, false],
          [true, false, false, true, false, false, false],
          [true, false, false, false, false, true, false],
          [false, true, false, false, false, true, false],
          [true, false, false, false, false, true, false],
          [false, false, true, true, true, false, true],
          [false, false, false, false, false, true, false],
        ]
      ),
      selectedZone: 0,
      reports: [],
    };
  }

  render() {
    let playerSpecs = this.state.players.map((player, index) => (
      <PlayerSpec
        key={index}
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
            newPlayers.splice(index, 1);
            return { players: newPlayers };
          });
        }}
      />
    ));
    if (this.state.players.length < 6) {
      // if we're under the max number of players, include the add player button
      playerSpecs.push(
        <Button
          key="add-player-button"
          onClick={() => {
            let newPlayers = this.state.players.map((player) => player.clone());
            newPlayers.push(
              new ScenarioPlayer(
                [0, 0, 0, 0, 0],
                Pistol,
                "",
                0,
                maxPlayerFocus,
                maxPlayerHealth
              )
            );
            this.setState({ players: newPlayers });
          }}
          sx={{
            bg: "primary",
            color: "white",
            width: 175,
            height: 300,
            p: 2,
            m: 2,
            borderRadius: 2,
            boxShadow: "0 0 16px rgba(0, 0, 0, .25)",
          }}
        >
          <Heading as="h3" textAlign="center" verticalAlign="middle">
            Add Player
          </Heading>
        </Button>
      );
    }
    return (
      <Box
        sx={{
          p: 4,
          color: "text",
          bg: "background",
          fontFamily: "body",
          fontWeight: "body",
          lineHeight: "body",
        }}
      >
        <Flex flexWrap="wrap">{playerSpecs}</Flex>
        <Flex flexWrap="wrap">
          <Box
            flex="1 1 auto"
            sx={{
              p: 2,
              m: 2,
              borderRadius: 2,
              boxShadow: "0 0 16px rgba(0, 0, 0, .25)",
            }}
          >
            <MapVis
              map={this.state.map}
              players={this.state.players}
              enemySetByZone={this.state.npcSetsByZone}
              selectedZone={this.state.selectedZone}
              setSelectedZone={(zone: number) => {
                this.setState({ selectedZone: zone });
              }}
            />
          </Box>
          <ZoneSpec
            zone={this.state.selectedZone}
            npcs={this.state.npcSetsByZone[this.state.selectedZone]}
            terrain={this.state.map.terrain[this.state.selectedZone]}
            handleNpcsChange={(newNpcSet) => {
              this.setState((state: ScenarioSpecState) => {
                let newNpcSetsByZone = state.npcSetsByZone.map((npcSet) =>
                  npcSet.clone()
                );
                newNpcSetsByZone[state.selectedZone] = newNpcSet;
                return { npcSetsByZone: newNpcSetsByZone };
              });
            }}
            handleTerrainChange={(newTerrain) => {
              this.setState((state: ScenarioSpecState) => {
                let newMap = state.map.clone();
                newMap.terrain[state.selectedZone] = newTerrain;
                return { map: newMap };
              });
            }}
          />
        </Flex>
        <StatsVis
          reports={this.state.reports}
          triggerNewSimulation={() => {
            let newReport = SimulateScenario(
              new Scenario(
                this.state.npcSetsByZone,
                this.state.players,
                this.state.map
              ),
              10000
            );
            this.setState((prevState) => {
              return { reports: prevState.reports.concat(newReport) };
            });
          }}
        />
      </Box>
    );
  }
}
