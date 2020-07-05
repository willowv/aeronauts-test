import * as React from "react";
import { PlayerStub } from "../simulator/scenario";
import { Card, Heading, Box, Flex } from "rebass";
import { Label, Select, Input } from "@rebass/forms";
import { WeaponOptions } from "../combatants/actions/playerActions";
import { Ability } from "../enum";
import { Action } from "../combatants/actions/action";

interface PlayerSpecProps {
    abilityScores : number[];
    weapon : Action;
    name : string;
    zone : number;
    zonesAvailable : number;
}

interface AbilitySpecProps {
    name : string;
    value : number;
}

class AbilitySpec extends React.Component<AbilitySpecProps> {
    render() {
        return (
            <Box width={1/5} px={2}>
                <Label>{this.props.name}</Label>
                <Input
                    id={this.props.name}
                    name={this.props.name}
                    type='number'
                    min='-1'
                    max='2'
                    defaultValue={this.props.value}
                />
            </Box>
        )
    }
}

// name at the top
// ability scores with numeric input
// weapon drop down selector
export class PlayerSpec extends React.Component<PlayerSpecProps> {
    render() {
        return <Card
            sx={{width: 350, p: 2, m:2, borderRadius: 2, boxShadow: '0 0 16px rgba(0, 0, 0, .25)'}}>
                <Label>Name</Label>
                <Input id='name'
                    name='name'
                    type='string'
                    defaultValue={this.props.name} />
                <Flex mx={-2} mb={3}>
                    <AbilitySpec
                        name='Per'
                        value={this.props.abilityScores[Ability.Perception]} />
                    <AbilitySpec
                        name='Int'
                        value={this.props.abilityScores[Ability.Intelligence]} />
                    <AbilitySpec
                        name='Coord'
                        value={this.props.abilityScores[Ability.Coordination]} />
                    <AbilitySpec
                        name='Agi'
                        value={this.props.abilityScores[Ability.Agility]} />
                    <AbilitySpec
                        name='Conv'
                        value={this.props.abilityScores[Ability.Conviction]} />
                </Flex>
                <Label>Weapon</Label>
                <Select
                    id='weapon'
                    name='weapon'
                    defaultValue={this.props.weapon.name}>
                        {WeaponOptions.map((weapon, index) => (
                            <option key={index}>{weapon.name}</option>))}
                </Select>
                <Label>Zone</Label>
                <Input
                    id='zone'
                    name='zone'
                    type='number'
                    min='0'
                    max={this.props.zonesAvailable - 1}
                    defaultValue={this.props.zone}
                />
        </Card>
    }
}