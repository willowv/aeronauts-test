import * as React from "react";
import { Card, Box, Flex, Button } from "rebass";
import { Label, Input, Select } from "@rebass/forms";
import { Ability } from "../enum";
import { Role, roleStrings, ScenarioPlayer } from "../simulation/scenario";
import {
  maxPlayerHealth,
  maxPlayerFocus,
} from "../simulation/combatants/player";

interface AbilitySpecProps {
  name: string;
  player: ScenarioPlayer;
  ability: Ability;
  handlePlayerChange: (newPlayer: ScenarioPlayer) => void;
}

const AbilitySpec = ({
  name,
  player,
  ability,
  handlePlayerChange,
}: AbilitySpecProps) => {
  return (
    <Box width={1 / 5} px={2}>
      <Label>{name}</Label>
      <Input
        id={name}
        name={name}
        type="number"
        min="-1"
        max="2"
        value={player.abilityScores[ability]}
        onChange={(event) => {
          let newScore = event.target.valueAsNumber;
          let newPlayer = player.clone();
          newPlayer.abilityScores[ability] = newScore;
          handlePlayerChange(newPlayer);
        }}
      />
    </Box>
  );
};

interface PlayerSpecProps {
  player: ScenarioPlayer;
  handlePlayerChange: (newPlayer: ScenarioPlayer) => void;
  handlePlayerDelete: () => void;
}

export const PlayerSpec = ({
  player,
  handlePlayerChange,
  handlePlayerDelete,
}: PlayerSpecProps) => {
  // Only show roles if we're in air combat
  let roleSpec =
    player.role === Role.Ground ? null : (
      <Box>
        <Label>Role</Label>
        <Select
          id="role"
          name="role"
          value={roleStrings[player.role]}
          onChange={(event) => {
            let newRole = event.target.selectedIndex as Role;
            let newPlayer = player.clone();
            newPlayer.role = newRole;
            handlePlayerChange(newPlayer);
          }}
        >
          {roleStrings.map((roleString, index) => (
            <option
              key={index}
              hidden={
                roleString === roleStrings[Role.Ground] ||
                (roleString === roleStrings[Role.Captain] &&
                  player.role !== Role.Captain) ||
                (roleString === roleStrings[Role.Engineer] &&
                  player.role !== Role.Engineer)
              }
            >
              {roleString}
            </option>
          ))}
        </Select>
      </Box>
    );
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
      <Flex>
        <Box flex="1 1 auto">
          <Label>Name</Label>
          <Input
            id="name"
            name="name"
            type="string"
            value={player.name}
            onChange={(event) => {
              let newPlayer = player.clone();
              newPlayer.name = event.target.value;
              handlePlayerChange(newPlayer);
            }}
          />
        </Box>
        <Box sx={{ paddingLeft: 2 }}>
          <Button
            backgroundColor={"secondary"}
            onClick={() => {
              handlePlayerDelete();
            }}
          >
            X
          </Button>
        </Box>
      </Flex>
      <Flex mx={-2} mb={3}>
        <Box width={1 / 2} px={2}>
          <Label>Health</Label>
          <Input
            id="health"
            name="health"
            type="number"
            min="0"
            max={maxPlayerHealth}
            value={player.health}
            onChange={(event) => {
              let newHealth = event.target.valueAsNumber;
              let newPlayer = player.clone();
              newPlayer.health = newHealth;
              handlePlayerChange(newPlayer);
            }}
          />
        </Box>
        <Box width={1 / 2} px={2}>
          <Label>Focus</Label>
          <Input
            id="focus"
            name="focus"
            type="number"
            min="0"
            max={maxPlayerFocus}
            value={player.focus}
            onChange={(event) => {
              let newFocus = event.target.valueAsNumber;
              let newPlayer = player.clone();
              newPlayer.focus = newFocus;
              handlePlayerChange(newPlayer);
            }}
          />
        </Box>
      </Flex>
      <Flex mx={-2} mb={3}>
        <AbilitySpec
          name="Per"
          player={player}
          ability={Ability.Perception}
          handlePlayerChange={handlePlayerChange}
        />
        <AbilitySpec
          name="Int"
          player={player}
          ability={Ability.Intelligence}
          handlePlayerChange={handlePlayerChange}
        />
        <AbilitySpec
          name="Coord"
          player={player}
          ability={Ability.Coordination}
          handlePlayerChange={handlePlayerChange}
        />
        <AbilitySpec
          name="Agi"
          player={player}
          ability={Ability.Agility}
          handlePlayerChange={handlePlayerChange}
        />
        <AbilitySpec
          name="Conv"
          player={player}
          ability={Ability.Conviction}
          handlePlayerChange={handlePlayerChange}
        />
      </Flex>
      {roleSpec}
    </Card>
  );
};
