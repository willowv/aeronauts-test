import React from "react";
import { Box, Flex, Heading, Button } from "rebass";
import {
  ScenarioEnemySet,
  ScenarioPlayer,
  Scenario,
} from "../simulation/scenario";
import { Attack } from "../simulation/combatants/actions/playerActions";
import { PlayerSpec } from "./PlayerSpec";
import { StatsVis } from "./StatsVis";
import { SimulateScenario } from "../simulation/simulator";
import { ScenarioReport } from "../simulation/statistics";
import {
  maxPlayerHealth,
  maxPlayerFocus,
} from "../simulation/combatants/player";
import { scenarioGenCon2020 } from "../scenarios/genCon2020";

// Player specs across the top, w/ plus button for adding more players

interface ScenarioSpecState {
  players: ScenarioPlayer[];
  enemySet: ScenarioEnemySet;
  reports: ScenarioReport[];
}

export class ScenarioSpec extends React.Component<any, ScenarioSpecState> {
  constructor(props: any) {
    super(props);
    this.state = scenarioGenCon2020();
  }

  render() {
    let playerSpecs = this.state.players.map((player, index) => (
      <PlayerSpec
        key={index}
        player={player}
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
                Attack,
                "",
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
        <StatsVis
          reports={this.state.reports}
          triggerNewSimulation={() => {
            let newReport = SimulateScenario(
              new Scenario(
                this.state.enemySet,
                this.state.players
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
