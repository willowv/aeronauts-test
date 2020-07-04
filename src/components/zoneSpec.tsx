import * as React from "react";
import { EnemySet, PlayerStub } from "../simulator/scenario";
import { Terrain, TerrainOptions } from "../map/terrain";
import { Card, Heading, Box, Flex } from "rebass";
import { Label, Select, Input } from "@rebass/forms";

interface ZoneSpecProps {
    zone : number;
    npcs : EnemySet;
    terrain : Terrain;
}

// zone index in top left
// Terrain, right of that, as a drop-down selector
// list of enemy types with combo box number input for each (Normal, Dangerous, Tough, Scary)
// list of zones that are connected to as a tag list
// list of players that are present as a tag list
export class ZoneSpec extends React.Component<ZoneSpecProps> {
    render() {
        return <Card
            width={375}
            sx={{p: 2, m:2, borderRadius: 2, boxShadow: '0 0 16px rgba(0, 0, 0, .25)'}}>
                <Heading as='h3'>
                    {'Zone ' + this.props.zone}
                </Heading>
                <Label>Terrain</Label>
                <Select
                    id='terrain'
                    name='terrain'
                    defaultValue={this.props.terrain.name}>
                        {TerrainOptions.map((terrain, index) => (
                        <option
                            key={index}>
                            {terrain.name}
                        </option>))}
                </Select>
                <Heading as='h4'>Enemies</Heading>
                <Flex mx={-2} mb={3}>
                    <Box width={1/4} px={2}>
                    <Label htmlFor='name'>Normal</Label>
                    <Input
                        id='normalEnemies'
                        name='normalEnemies'
                        type='number'
                        min='0'
                        defaultValue={this.props.npcs.cNormal}
                    />
                    </Box>
                    <Box width={1/4} px={2}>
                    <Label htmlFor='name'>Dangerous</Label>
                    <Input
                        id='dangerousEnemies'
                        name='dangerousEnemies'
                        type='number'
                        min='0'
                        defaultValue={this.props.npcs.cDangerous}
                    />
                    </Box>
                    <Box width={1/4} px={2}>
                    <Label htmlFor='name'>Tough</Label>
                    <Input
                        id='toughEnemies'
                        name='toughEnemies'
                        type='number'
                        min='0'
                        defaultValue={this.props.npcs.cTough}
                    />
                    </Box>
                    <Box width={1/4} px={2}>
                    <Label htmlFor='name'>Scary</Label>
                    <Input
                        id='scaryEnemies'
                        name='scaryEnemies'
                        type='number'
                        min='0'
                        defaultValue={this.props.npcs.cScary}
                    />
                    </Box>
                </Flex>
        </Card>
    }
}