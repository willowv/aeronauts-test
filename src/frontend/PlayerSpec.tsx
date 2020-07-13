import * as React from "react";
import { Card, Box, Flex, Button } from "rebass";
import { Label, Select, Input } from "@rebass/forms";
import { WeaponOptions } from "../simulation/combatants/actions/playerActions";
import { Ability } from "../enum";
import { PlayerStub } from "../simulation/scenario";

interface AbilitySpecProps {
  name: string;
  player: PlayerStub;
  ability: Ability;
  handlePlayerChange: (newPlayer: PlayerStub) => void;
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
  player: PlayerStub;
  zonesAvailable: number;
  handlePlayerChange: (newPlayer: PlayerStub) => void;
  handlePlayerDelete: () => void;
}

export const PlayerSpec = ({
  player,
  zonesAvailable,
  handlePlayerChange,
  handlePlayerDelete,
}: PlayerSpecProps) => {
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
      <Label>Weapon</Label>
      <Select
        id="weapon"
        name="weapon"
        value={player.weapon.name}
        onChange={(event) => {
          let newPlayer = player.clone();
          newPlayer.weapon = WeaponOptions[event.target.selectedIndex];
          handlePlayerChange(newPlayer);
        }}
      >
        {WeaponOptions.map((weapon, index) => (
          <option key={index}>{weapon.name}</option>
        ))}
      </Select>
      <Label>Zone</Label>
      <Input
        id="zone"
        name="zone"
        type="number"
        min="0"
        max={zonesAvailable - 1}
        value={player.zone}
        onChange={(event) => {
          let newZone = event.target.valueAsNumber;
          let newPlayer = player.clone();
          newPlayer.zone = newZone;
          handlePlayerChange(newPlayer);
        }}
      />
    </Card>
  );
};
