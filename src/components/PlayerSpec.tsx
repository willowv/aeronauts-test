import * as React from "react";
import { PlayerStub } from "../simulator/scenario";
import { Card, Heading, Box, Flex } from "rebass";
import { Label, Select, Input } from "@rebass/forms";
import { WeaponOptions } from "../combatants/actions/playerActions";
import { Ability } from "../enum";

// name at the top
// ability scores with numeric input
// weapon drop down selector
export class PlayerSpec extends React.Component<PlayerStub> {
    render() {
        return <Card
            sx={{width: 350, height: 200, p: 2, m:2, borderRadius: 2, boxShadow: '0 0 16px rgba(0, 0, 0, .25)'}}>
                <Heading as='h3'>
                    {this.props.name}
                </Heading>
                <Flex mx={-2} mb={3}>
                    <Box width={1/5} px={2}>
                    <Label htmlFor='name'>Per</Label>
                    <Input
                        id='perception'
                        name='perception'
                        type='number'
                        min='-1'
                        max='2'
                        defaultValue={this.props.abilityScores[Ability.Perception]}
                    />
                    </Box>
                    <Box width={1/5} px={2}>
                    <Label htmlFor='name'>Int</Label>
                    <Input
                        id='intelligence'
                        name='intelligence'
                        type='number'
                        min='-1'
                        max='2'
                        defaultValue={this.props.abilityScores[Ability.Intelligence]}
                    />
                    </Box>
                    <Box width={1/5} px={2}>
                    <Label htmlFor='name'>Coord</Label>
                    <Input
                        id='coordination'
                        name='coordination'
                        type='number'
                        min='-1'
                        max='2'
                        defaultValue={this.props.abilityScores[Ability.Coordination]}
                    />
                    </Box>
                    <Box width={1/5} px={2}>
                    <Label htmlFor='name'>Agi</Label>
                    <Input
                        id='agility'
                        name='agility'
                        type='number'
                        min='-1'
                        max='2'
                        defaultValue={this.props.abilityScores[Ability.Agility]}
                    />
                    </Box>
                    <Box width={1/5} px={2}>
                    <Label htmlFor='name'>Conv</Label>
                    <Input
                        id='conviction'
                        name='conviction'
                        type='number'
                        min='-1'
                        max='2'
                        defaultValue={this.props.abilityScores[Ability.Conviction]}
                    />
                    </Box>
                </Flex>
                <Label>Weapon</Label>
                <Select
                    id='weapon'
                    name='weapon'
                    defaultValue={this.props.weapon.name}>
                        {WeaponOptions.map((weapon, index) => (
                        <option
                            key={index}>
                            {weapon.name}
                        </option>))}
                </Select>
        </Card>
    }
}