import * as React from "react";
import { PlayerStub, EnemySet } from "../simulator/scenario";
import { GameMap } from "../map/map";
import { Box } from "rebass";

interface MapVisProps {
    map : GameMap;
    playerIndexByZone : number[][];
    enemySetByZone : EnemySet[];
    selectedZone : number;
}

export class MapVis extends React.Component<MapVisProps> {
    render() {
        let graphElements : cytoscape.ElementDefinition[] = 
            this.props.map.terrain.map((terrain, zone) => {
                return {
                    data: {
                        id: 'z'+zone,
                        label: 'Zone '+zone
                    },
                    position: {x:zone, y:0},
                    selected: zone == this.props.selectedZone,
                    locked: true
                }
            });
        
        // every true in adjacency is an edge, except duplicates
        this.props.map.moveAdjacency.forEach((connectedTo, sourceZone) => {
            connectedTo.forEach((connected, targetZone) => {
                if(connected)
                    graphElements.push({
                        data: {
                            id:'e' + sourceZone + targetZone,
                            source: 'z' + sourceZone,
                            target: 'z' + targetZone
                        }
                    });
            });
        });

        // Use terrain to generate nodes
        // Use adjacency matrix to generate edges
        return (
            <Box />
        );
    }
}