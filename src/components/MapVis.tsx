import * as React from "react";
import { PlayerStub, EnemySet } from "../simulator/scenario";
import { GameMap } from "../map/map";
import { Box, Heading } from "rebass";
import { Flowpoint, Flowspace } from 'flowpoints';

interface MapVisProps {
    map : GameMap;
    playerIndexByZone : number[][];
    enemySetByZone : EnemySet[];
    selectedZone : number;
    setSelectedZone : (zone : number) => void;
}

const verticalSpacing = 100;
const horizontalSpacing = 200;

export class MapVis extends React.Component<MapVisProps> {
    render() {
        let flowpoints : JSX.Element[] = this.props.map.terrain.map((terrain, zone) => {
            let x = this.props.map.positioning[zone].x * horizontalSpacing;
            let y = this.props.map.positioning[zone].y * verticalSpacing;
            return (
                <Flowpoint
                    key={zone}
                    outputs={this.props.map.ZonesMovableFrom(zone)}
                    startPosition={{ x:x, y:y }}
                    onClick={() => {
                        this.props.setSelectedZone(zone);
                    }}
                >
                    <Heading as='h3'>
                        {'Zone ' + zone}
                    </Heading>
                    Terrain: {terrain.name}
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