import React from "react";
import { Box, Flex, Heading, Button } from "rebass";
import {
  ScenarioEnemySet,
  ScenarioPlayer,
  Scenario,
  Role,
  ScenarioPlayerAirship,
  ScenarioEnemyAirship,
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
import { EnemySpec } from "./EnemiesSpec";
import { Label, Checkbox } from "@rebass/forms";
import { PlayerAirshipSpec } from "./PlayerAirshipSpec";

// Player specs across the top, w/ plus button for adding more players

interface ScenarioSpecState {
  isAirCombat: boolean;
  playerAirship: ScenarioPlayerAirship | null;
  enemyAirship: ScenarioEnemyAirship | null;
  players: ScenarioPlayer[];
  enemySet: ScenarioEnemySet;
  reports: ScenarioReport[];
}

export class ScenarioSpec extends React.Component<any, ScenarioSpecState> {
  constructor(props: any) {
    super(props);
    this.state = scenarioGenCon2020();
  }

  ensureCaptainAndEngineer(players: ScenarioPlayer[]): ScenarioPlayer[] {
    let indexCurCaptain = players.findIndex(
      (player) => player.role === Role.Captain
    );
    let indexCurEngineer = players.findIndex(
      (player) => player.role === Role.Engineer
    );
    let indexNewCaptain = indexCurCaptain !== -1 ? indexCurCaptain : 0;
    if (indexNewCaptain === indexCurEngineer) indexNewCaptain++;
    let indexNewEngineer = indexCurEngineer !== -1 ? indexCurEngineer : 0;
    if (indexNewEngineer === indexNewCaptain) indexNewEngineer++;

    return players.map((player, index) => {
      let newPlayer = player.clone();
      if (index === indexNewCaptain) newPlayer.role = Role.Captain;
      if (index === indexNewEngineer) newPlayer.role = Role.Engineer;
      return newPlayer;
    });
  }

  render() {
    let playerSpecs = this.state.players.map((player, index) => (
      <PlayerSpec
        key={index}
        player={player}
        handlePlayerChange={(newPlayer) => {
          this.setState((state) => {
            // if there is no captain, make the first non-engineer player the captain
            // if there is no engineer, make the first non-captain player the engineer
            let newPlayers = state.players.map((player) => player.clone());
            newPlayers[index] = newPlayer;
            return { players: this.ensureCaptainAndEngineer(newPlayers) };
          });
        }}
        handlePlayerDelete={() => {
          this.setState((state) => {
            let newPlayers = state.players.map((player) => player.clone());
            newPlayers.splice(index, 1);
            return { players: this.ensureCaptainAndEngineer(newPlayers) };
          });
        }}
      />
    ));
    if (this.state.players.length < 5) {
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
                "Player",
                maxPlayerFocus,
                maxPlayerHealth,
                this.state.isAirCombat ? Role.Interceptor : Role.Ground
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
    if (this.state.isAirCombat) {
      playerSpecs.unshift(
        <PlayerAirshipSpec
          players={this.state.players}
          handleCaptainChange={(indexNewCaptain) =>
            this.setState((prevState) => {
              let indexCurCaptain = prevState.players.findIndex(
                (player) => player.role === Role.Captain
              );
              let indexCurEngineer = prevState.players.findIndex(
                (player) => player.role === Role.Engineer
              );
              let newPlayers = prevState.players.map((player, index) => {
                let newPlayer = player.clone();
                if (index === indexCurCaptain) {
                  if (indexCurEngineer === indexNewCaptain)
                    newPlayer.role = Role.Engineer;
                  else newPlayer.role = Role.Interceptor;
                } else if (indexNewCaptain === index)
                  newPlayer.role = Role.Captain;

                return newPlayer;
              });
              return { players: newPlayers };
            })
          }
          handleEngineerChange={(indexNewEngineer) =>
            this.setState((prevState) => {
              let indexCurCaptain = prevState.players.findIndex(
                (player) => player.role === Role.Captain
              );
              let indexCurEngineer = prevState.players.findIndex(
                (player) => player.role === Role.Engineer
              );
              let newPlayers = prevState.players.map((player, index) => {
                let newPlayer = player.clone();
                if (index === indexCurEngineer) {
                  if (indexCurCaptain === indexNewEngineer)
                    newPlayer.role = Role.Captain;
                  else newPlayer.role = Role.Bomber;
                } else if (indexNewEngineer === index)
                  newPlayer.role = Role.Engineer;

                return newPlayer;
              });
              return { players: newPlayers };
            })
          }
        />
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
        <Label>
          <Checkbox
            id="isaircombat"
            name="isaircombat"
            onChange={() => {
              this.setState((prevState) => {
                // if we have entered air combat, set players 0 and 1 as Captain and Engineer and others as Interceptor
                // if we have exited air combat, set all players to Ground role
                let newPlayers = [];
                if (prevState.isAirCombat) {
                  newPlayers = prevState.players.map((player, index) => {
                    let newPlayer = player.clone();
                    newPlayer.role = Role.Ground;
                    return newPlayer;
                  });
                } else {
                  newPlayers = prevState.players.map((player, index) => {
                    let newPlayer = player.clone();
                    if (index === 0) newPlayer.role = Role.Captain;
                    else if (index === 1) newPlayer.role = Role.Engineer;
                    else newPlayer.role = Role.Interceptor;

                    return newPlayer;
                  });
                }
                return {
                  isAirCombat: !prevState.isAirCombat,
                  players: newPlayers,
                };
              });
            }}
            checked={this.state.isAirCombat}
          />
          Air Combat
        </Label>
        <Flex flexWrap="wrap">{playerSpecs}</Flex>
        <Flex flexWrap="wrap">
          <EnemySpec
            npcs={this.state.enemySet}
            handleNpcsChange={(newEnemySet: ScenarioEnemySet) => {
              this.setState((prevState) => {
                return { enemySet: newEnemySet };
              });
            }}
          />
        </Flex>
        <StatsVis
          reports={this.state.reports}
          triggerNewSimulation={() => {
            let newReport = SimulateScenario(
              new Scenario(
                false, // TODO: support air combat
                this.state.enemySet,
                this.state.players,
                null,
                null
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
