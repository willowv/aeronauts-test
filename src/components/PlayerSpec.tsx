import * as React from "react";
import { PlayerStub } from "../simulator/scenario";
import { Card, Heading, Box, Flex, Button } from "rebass";
import { Label, Select, Input } from "@rebass/forms";
import { WeaponOptions } from "../combatants/actions/playerActions";
import { Ability } from "../enum";
import { Action } from "../combatants/actions/action";

interface AbilitySpecProps {
    name : string;
    value : number;
    handleScoreChange : (newScore : number) => void;
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
                    value={this.props.value}
                    onChange={(event) => {
                        let newScore = event.target.valueAsNumber;
                        this.props.handleScoreChange(newScore);
                    }}
                />
            </Box>
        )
    }
}

interface PlayerSpecProps {
    player : PlayerStub;
    zonesAvailable : number;
    handlePlayerChange : (newPlayer : PlayerStub) => void;
    handlePlayerDelete : () => void;
}

export class PlayerSpec extends React.Component<PlayerSpecProps> {
    render() {
        return <Card
            sx={{width: 350, p: 2, m:2, borderRadius: 2, boxShadow: '0 0 16px rgba(0, 0, 0, .25)'}}>
                <Flex>
                    <Box flex='1 1 auto'>
                        <Label>Name</Label>
                        <Input id='name'
                            name='name'
                            type='string'
                            value={this.props.player.name}
                            onChange={(event) => {
                                let newPlayer = this.props.player.clone();
                                newPlayer.name = event.target.value;
                                this.props.handlePlayerChange(newPlayer);
                            }} />
                    </Box>
                    <Box sx={{paddingLeft:2}}>
                        <Button
                            backgroundColor={'secondary'}
                            onClick={()=> {
                            this.props.handlePlayerDelete();
                        }}>X</Button>
                    </Box>
                </Flex>
                <Flex mx={-2} mb={3}>
                    <AbilitySpec
                        name='Per'
                        value={this.props.player.abilityScores[Ability.Perception]}
                        handleScoreChange={(newScore) => {
                            let newPlayer = this.props.player.clone();
                            newPlayer.abilityScores[Ability.Perception] = newScore;
                            this.props.handlePlayerChange(newPlayer);
                        }} />
                    <AbilitySpec
                        name='Int'
                        value={this.props.player.abilityScores[Ability.Intelligence]}
                        handleScoreChange={(newScore) => {
                            let newPlayer = this.props.player.clone();
                            newPlayer.abilityScores[Ability.Intelligence] = newScore;
                            this.props.handlePlayerChange(newPlayer);
                        }} />
                    <AbilitySpec
                        name='Coord'
                        value={this.props.player.abilityScores[Ability.Coordination]}
                        handleScoreChange={(newScore) => {
                            let newPlayer = this.props.player.clone();
                            newPlayer.abilityScores[Ability.Coordination] = newScore;
                            this.props.handlePlayerChange(newPlayer);
                        }} />
                    <AbilitySpec
                        name='Agi'
                        value={this.props.player.abilityScores[Ability.Agility]}
                        handleScoreChange={(newScore) => {
                            let newPlayer = this.props.player.clone();
                            newPlayer.abilityScores[Ability.Agility] = newScore;
                            this.props.handlePlayerChange(newPlayer);
                        }} />
                    <AbilitySpec
                        name='Conv'
                        value={this.props.player.abilityScores[Ability.Conviction]}
                        handleScoreChange={(newScore) => {
                            let newPlayer = this.props.player.clone();
                            newPlayer.abilityScores[Ability.Conviction] = newScore;
                            this.props.handlePlayerChange(newPlayer);
                        }} />
                </Flex>
                <Label>Weapon</Label>
                <Select
                    id='weapon'
                    name='weapon'
                    value={this.props.player.weapon.name}
                    onChange={(event) => {
                        let newPlayer = this.props.player.clone();
                        newPlayer.weapon = WeaponOptions[event.target.selectedIndex];
                        this.props.handlePlayerChange(newPlayer);
                    }}>
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
                    value={this.props.player.zone}
                    onChange={(event) => {
                        let newZone = event.target.valueAsNumber;
                        let newPlayer = this.props.player.clone();
                        newPlayer.zone = newZone;
                        this.props.handlePlayerChange(newPlayer);
                    }}
                />
        </Card>
    }
}