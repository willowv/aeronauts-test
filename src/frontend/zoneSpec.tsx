import * as React from "react";
import { Terrain, TerrainOptions } from "../simulation/map/terrain";
import { Card, Heading, Box, Flex } from "rebass";
import { Label, Select, Input } from "@rebass/forms";
import { EnemySet } from "../simulation/scenario";

interface ZoneSpecProps {
  zone: number;
  npcs: EnemySet;
  terrain: Terrain;
  handleTerrainChange: (newTerrain: Terrain) => void;
  handleNpcsChange: (npcs: EnemySet) => void;
}

// zone index in top left
// Terrain, right of that, as a drop-down selector
// list of enemy types with combo box number input for each (Normal, Dangerous, Tough, Scary)
// list of zones that are connected to as a tag list
// list of players that are present as a tag list
export const ZoneSpec = ({
  zone,
  npcs,
  terrain,
  handleTerrainChange,
  handleNpcsChange,
}: ZoneSpecProps) => {
  return (
    <Card
      width={375}
      sx={{
        p: 2,
        m: 2,
        borderRadius: 2,
        boxShadow: "0 0 16px rgba(0, 0, 0, .25)",
      }}
    >
      <Heading as="h3">{"Zone " + zone}</Heading>
      <Label>Terrain</Label>
      <Select
        id="terrain"
        name="terrain"
        value={terrain.name}
        onChange={(event) => {
          let newTerrain = TerrainOptions[event.target.selectedIndex];
          handleTerrainChange(newTerrain);
        }}
      >
        {TerrainOptions.map((terrain, index) => (
          <option key={index}>{terrain.name}</option>
        ))}
      </Select>
      <Heading as="h4">Enemies</Heading>
      <Flex mx={-2} mb={3}>
        <Box width={1 / 2} px={2}>
          <Label htmlFor="name">Normal</Label>
          <Input
            id="normalEnemies"
            name="normalEnemies"
            type="number"
            min="0"
            value={npcs.cNormal}
            onChange={(event) => {
              let newCount = event.target.valueAsNumber;
              let newNpcs = npcs.clone();
              newNpcs.cNormal = newCount;
              handleNpcsChange(newNpcs);
            }}
          />
        </Box>
        <Box width={1 / 2} px={2}>
          <Label htmlFor="name">Dangerous</Label>
          <Input
            id="dangerousEnemies"
            name="dangerousEnemies"
            type="number"
            min="0"
            value={npcs.cDangerous}
            onChange={(event) => {
              let newCount = event.target.valueAsNumber;
              let newNpcs = npcs.clone();
              newNpcs.cDangerous = newCount;
              handleNpcsChange(newNpcs);
            }}
          />
        </Box>
      </Flex>
      <Flex mx={-2} mb={3}>
        <Box width={1 / 2} px={2}>
          <Label htmlFor="name">Tough</Label>
          <Input
            id="toughEnemies"
            name="toughEnemies"
            type="number"
            min="0"
            value={npcs.cTough}
            onChange={(event) => {
              let newCount = event.target.valueAsNumber;
              let newNpcs = npcs.clone();
              newNpcs.cTough = newCount;
              handleNpcsChange(newNpcs);
            }}
          />
        </Box>
        <Box width={1 / 2} px={2}>
          <Label htmlFor="name">Scary</Label>
          <Input
            id="scaryEnemies"
            name="scaryEnemies"
            type="number"
            min="0"
            value={npcs.cScary}
            onChange={(event) => {
              let newCount = event.target.valueAsNumber;
              let newNpcs = npcs.clone();
              newNpcs.cScary = newCount;
              handleNpcsChange(newNpcs);
            }}
          />
        </Box>
      </Flex>
    </Card>
  );
};
