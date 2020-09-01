import * as React from "react";
import { Card, Heading, Box, Flex } from "rebass";
import { Label, Input } from "@rebass/forms";
import { ScenarioEnemySet } from "../simulation/scenario";
import { EnemyType } from "../enum";

interface NpcSpecProps {
  name: string;
  npcs: ScenarioEnemySet;
  combatantType: EnemyType;
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

interface ZoneSpecProps {
  zone: number;
  npcs: ScenarioEnemySet;
  handleNpcsChange: (npcs: ScenarioEnemySet) => void;
}

export const ZoneSpec = ({
  zone,
  npcs,
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
      <Heading as="h4">Enemies</Heading>
      <Flex mx={-2} mb={3}>
        <NpcSpec
          name="Normal"
          npcs={npcs}
          combatantType={EnemyType.Normal}
          handleNpcsChange={handleNpcsChange}
        />
        <NpcSpec
          name="Dangerous"
          npcs={npcs}
          combatantType={EnemyType.Dangerous}
          handleNpcsChange={handleNpcsChange}
        />
        <NpcSpec
          name="Tough"
          npcs={npcs}
          combatantType={EnemyType.Tough}
          handleNpcsChange={handleNpcsChange}
        />
        <NpcSpec
          name="Scary"
          npcs={npcs}
          combatantType={EnemyType.Scary}
          handleNpcsChange={handleNpcsChange}
        />
      </Flex>
    </Card>
  );
};
