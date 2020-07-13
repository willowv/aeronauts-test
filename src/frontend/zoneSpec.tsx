import * as React from "react";
import { Terrain, TerrainOptions } from "../simulation/map/terrain";
import { Card, Heading, Box, Flex } from "rebass";
import { Label, Select, Input } from "@rebass/forms";
import { EnemySet } from "../simulation/scenario";
import { CombatantType } from "../enum";

interface NpcSpecProps {
  name: string;
  npcs: EnemySet;
  combatantType: CombatantType;
  handleNpcsChange: (npcs: EnemySet) => void;
}

const NpcSpec = ({
  name,
  npcs,
  combatantType,
  handleNpcsChange,
}: NpcSpecProps) => {
  return (
    <Box width={1 / 2} px={2}>
      <Label>{name}</Label>
      <Input
        id={name}
        name={name}
        type="number"
        min="0"
        value={npcs.count[combatantType]}
        onChange={(event) => {
          let newCount = event.target.valueAsNumber;
          let newNpcs = npcs.clone();
          newNpcs.count[combatantType] = newCount;
          handleNpcsChange(newNpcs);
        }}
      />
    </Box>
  );
};

interface ZoneSpecProps {
  zone: number;
  npcs: EnemySet;
  terrain: Terrain;
  handleTerrainChange: (newTerrain: Terrain) => void;
  handleNpcsChange: (npcs: EnemySet) => void;
}

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
        <NpcSpec
          name="Normal"
          npcs={npcs}
          combatantType={CombatantType.Normal}
          handleNpcsChange={handleNpcsChange}
        />
        <NpcSpec
          name="Dangerous"
          npcs={npcs}
          combatantType={CombatantType.Dangerous}
          handleNpcsChange={handleNpcsChange}
        />
        <NpcSpec
          name="Tough"
          npcs={npcs}
          combatantType={CombatantType.Tough}
          handleNpcsChange={handleNpcsChange}
        />
        <NpcSpec
          name="Scary"
          npcs={npcs}
          combatantType={CombatantType.Scary}
          handleNpcsChange={handleNpcsChange}
        />
      </Flex>
    </Card>
  );
};
