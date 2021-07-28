import * as React from "react";
import { Card, Heading } from "rebass";
import { Label, Select } from "@rebass/forms";
import { Role, ScenarioPlayer } from "../simulation/scenario";

interface PlayerAirshipSpecProps {
  players: ScenarioPlayer[];
  handleCaptainChange: (indexPlayer: number) => void;
  handleEngineerChange: (indexPlayer: number) => void;
}

export const PlayerAirshipSpec = ({
  players,
  handleCaptainChange,
  handleEngineerChange,
}: PlayerAirshipSpecProps) => {
  let playerCaptain = players.find((player) => player.role === Role.Captain);
  let playerEngineer = players.find((player) => player.role === Role.Engineer);
  return (
    <Card
      sx={{
        width: 350,
        p: 2,
        m: 2,
        borderRadius: 2,
        boxShadow: "0 0 16px rgba(0, 0, 0, .25)",
      }}
    >
      <Heading as="h3">Player Airship</Heading>
      <Label>Captain</Label>
      <Select
        id="captain"
        name="captain"
        value={playerCaptain?.name ?? "None"}
        onChange={(event) => {
          handleCaptainChange(event.target.selectedIndex);
        }}
      >
        {players.map((player, index) => (
          <option key={index}>{player.name}</option>
        ))}
      </Select>
      <Label>Engineer</Label>
      <Select
        id="engineer"
        name="engineer"
        value={playerEngineer?.name ?? "None"}
        onChange={(event) => {
          handleEngineerChange(event.target.selectedIndex);
        }}
      >
        {players.map((player, index) => (
          <option key={index}>{player.name}</option>
        ))}
      </Select>
    </Card>
  );
};
