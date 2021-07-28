import * as React from "react";
import { Card, Heading, Box, Flex } from "rebass";
import { Label, Input, Select } from "@rebass/forms";
import {
  EnemyLevel,
  enemyLevelStrings,
  ScenarioEnemyAirship,
  ScenarioEnemySet,
} from "../simulation/scenario";

interface NpcSpecProps {
  name: string;
  npcs: ScenarioEnemySet;
  combatantType: EnemyLevel;
  handleNpcsChange: (npcs: ScenarioEnemySet) => void;
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
        value={npcs.countByCombatantType[combatantType]}
        onChange={(event) => {
          let newCount = event.target.valueAsNumber;
          let newNpcs = npcs.clone();
          newNpcs.countByCombatantType[combatantType] = newCount;
          handleNpcsChange(newNpcs);
        }}
      />
    </Box>
  );
};

interface EnemySpecProps {
  isAirCombat: boolean;
  npcs: ScenarioEnemySet;
  airship: ScenarioEnemyAirship | null;
  handleNpcsChange: (npcs: ScenarioEnemySet) => void;
  handleAirshipChange: (airship: ScenarioEnemyAirship | null) => void;
}

export const EnemySpec = ({
  isAirCombat,
  npcs,
  airship,
  handleNpcsChange,
  handleAirshipChange,
}: EnemySpecProps) => {
  let airshipOptions = enemyLevelStrings.map((enemyLevelString, index) => (
    <option key={index}>{enemyLevelString}</option>
  ));
  airshipOptions.push(<option key={4}>None</option>);
  let airshipSpec = !isAirCombat ? null : (
    <Box>
      <Label>Airship</Label>
      <Select
        id="enemyAirship"
        name="enemyAirship"
        value={airship === null ? "None" : enemyLevelStrings[airship.level]}
        onChange={(event) => {
          let newAirship = null;
          if (event.target.selectedIndex !== 4)
            newAirship = new ScenarioEnemyAirship(event.target.selectedIndex);
          handleAirshipChange(newAirship);
        }}
      >
        {airshipOptions}
      </Select>
    </Box>
  );
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
      <Heading as="h3">Enemies</Heading>
      <Flex mx={-2} mb={3}>
        <NpcSpec
          name="Normal"
          npcs={npcs}
          combatantType={EnemyLevel.Normal}
          handleNpcsChange={handleNpcsChange}
        />
        <NpcSpec
          name="Dangerous"
          npcs={npcs}
          combatantType={EnemyLevel.Dangerous}
          handleNpcsChange={handleNpcsChange}
        />
        <NpcSpec
          name="Tough"
          npcs={npcs}
          combatantType={EnemyLevel.Tough}
          handleNpcsChange={handleNpcsChange}
        />
        <NpcSpec
          name="Scary"
          npcs={npcs}
          combatantType={EnemyLevel.Scary}
          handleNpcsChange={handleNpcsChange}
        />
      </Flex>
      {airshipSpec}
    </Card>
  );
};
