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
export class ZoneSpec extends React.Component<ZoneSpecProps> {
  render() {
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
        <Heading as="h3">{"Zone " + this.props.zone}</Heading>
        <Label>Terrain</Label>
        <Select
          id="terrain"
          name="terrain"
          value={this.props.terrain.name}
          onChange={(event) => {
            let newTerrain = TerrainOptions[event.target.selectedIndex];
            this.props.handleTerrainChange(newTerrain);
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
              value={this.props.npcs.cNormal}
              onChange={(event) => {
                let newCount = event.target.valueAsNumber;
                let newNpcs = this.props.npcs.clone();
                newNpcs.cNormal = newCount;
                this.props.handleNpcsChange(newNpcs);
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
              value={this.props.npcs.cDangerous}
              onChange={(event) => {
                let newCount = event.target.valueAsNumber;
                let newNpcs = this.props.npcs.clone();
                newNpcs.cDangerous = newCount;
                this.props.handleNpcsChange(newNpcs);
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
              value={this.props.npcs.cTough}
              onChange={(event) => {
                let newCount = event.target.valueAsNumber;
                let newNpcs = this.props.npcs.clone();
                newNpcs.cTough = newCount;
                this.props.handleNpcsChange(newNpcs);
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
              value={this.props.npcs.cScary}
              onChange={(event) => {
                let newCount = event.target.valueAsNumber;
                let newNpcs = this.props.npcs.clone();
                newNpcs.cScary = newCount;
                this.props.handleNpcsChange(newNpcs);
              }}
            />
          </Box>
        </Flex>
      </Card>
    );
  }
}
