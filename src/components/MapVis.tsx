import * as React from "react";
import { PlayerStub, EnemySet } from "../simulator/scenario";
import { GameMap } from "../map/map";
import { Box, Heading, Card } from "rebass";
import { Flowpoint, Flowspace } from 'flowpoints';

interface MapVisProps {
    map : GameMap;
    players : PlayerStub[];
    enemySetByZone : EnemySet[];
    selectedZone : number;
    setSelectedZone : (zone : number) => void;
}

const BadgeStyle = {
    display: 'inline-block',
    color: 'white',
    bg: 'primary',
    px: 2,
    py: 1,
    m: 1,
    borderRadius: 9999,
  };

const verticalSpacing = 200;
const horizontalSpacing = 250;
const margins = 50;

export class MapVis extends React.Component<MapVisProps> {
    render() {
        let flowpoints : JSX.Element[] = this.props.map.terrain.map((terrain, zone) => {
            let x = this.props.map.positioning[zone].x * horizontalSpacing + margins;
            let y = this.props.map.positioning[zone].y * verticalSpacing + margins;
            let outputs = this.props.map.ZonesMovableFrom(zone)
                .filter((zoneDest) => zoneDest > zone); // don't add repeat edges
            let players = this.props.players.filter((player) => player.zone == zone);
            return (
                <Flowpoint
                    key={zone}
                    outputs={outputs}
                    startPosition={{ x:x, y:y }}
                    onClick={() => {
                        this.props.setSelectedZone(zone);
                    }}>
                    <Card
                        sx={{p: 2, borderRadius: 2, boxShadow: '0 0 16px rgba(0, 0, 0, .25)'}}>
                        <Heading as='h3'>
                            {'Zone ' + zone}
                        </Heading>
                        Terrain: {terrain.name}
                        {players.map((player) => (
                            <Box sx={BadgeStyle}>{player.name}</Box>
                        ))}
                    </Card>
                </Flowpoint>
            );
        });

        // Use terrain to generate nodes
        // Use adjacency matrix to generate edges
        return (
            <Flowspace
                selected={this.props.selectedZone}
            >
                {flowpoints}
            </Flowspace>
        );
    }
}