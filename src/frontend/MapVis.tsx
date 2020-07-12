import * as React from "react";
import { GameMap } from "../simulation/map/map";
import { Box, Heading, Card } from "rebass";
import { Flowpoint, Flowspace } from "flowpoints";
import { PlayerStub, EnemySet } from "../simulation/scenario";

interface MapVisProps {
  map: GameMap;
  players: PlayerStub[];
  enemySetByZone: EnemySet[];
  selectedZone: number;
  setSelectedZone: (zone: number) => void;
}

const PlayerBadgeStyle = {
  display: "inline-block",
  color: "white",
  bg: "primary",
  px: 2,
  py: 1,
  m: 0.5,
  borderRadius: 9999,
};

const NpcBadgeStyle = {
  display: "inline-block",
  color: "white",
  bg: "secondary",
  px: 2,
  py: 1,
  m: 0.5,
  borderRadius: 9999,
};

const ZoneStyle = {
  p: 2,
  borderRadius: 2,
  boxShadow: "0 0 16px rgba(0, 0, 0, .4)",
};
const ZoneSelected = {
  p: 2,
  borderRadius: 2,
  boxShadow: "0 0 16px rgba(0, 0, 255, .4)",
};

const verticalSpacing = 200;
const horizontalSpacing = 300;
const margins = 50;

export class MapVis extends React.Component<MapVisProps> {
  render() {
    let flowpoints: JSX.Element[] = this.props.map.terrain.map(
      (terrain, zone) => {
        let x =
          this.props.map.positioning[zone].x * horizontalSpacing + margins;
        let y = this.props.map.positioning[zone].y * verticalSpacing + margins;
        let outputs = this.props.map
          .ZonesMovableFrom(zone)
          .filter((zoneDest) => zoneDest > zone); // don't add repeat edges
        let players = this.props.players.filter(
          (player) => player.zone === zone
        );
        let npcSet = this.props.enemySetByZone[zone];
        let enemyBadges: JSX.Element[] = [];
        if (npcSet.cNormal > 0)
          enemyBadges.push(
            <Box sx={NpcBadgeStyle}>{"N: " + npcSet.cNormal}</Box>
          );
        if (npcSet.cDangerous > 0)
          enemyBadges.push(
            <Box sx={NpcBadgeStyle}>{"D: " + npcSet.cDangerous}</Box>
          );
        if (npcSet.cTough > 0)
          enemyBadges.push(
            <Box sx={NpcBadgeStyle}>{"T: " + npcSet.cTough}</Box>
          );
        if (npcSet.cScary > 0)
          enemyBadges.push(
            <Box sx={NpcBadgeStyle}>{"S: " + npcSet.cScary}</Box>
          );

        let style = this.props.selectedZone === zone ? ZoneSelected : ZoneStyle;
        return (
          <Flowpoint
            key={zone}
            outputs={outputs}
            startPosition={{ x: x, y: y }}
            width={200}
            onClick={() => {
              this.props.setSelectedZone(zone);
            }}
          >
            <Card sx={style}>
              <Heading as="h3">{"Zone " + zone}</Heading>
              <p>{"Terrain: " + terrain.name}</p>
              {players.map((player) => (
                <Box sx={PlayerBadgeStyle}>{player.name}</Box>
              ))}
              {enemyBadges}
            </Card>
          </Flowpoint>
        );
      }
    );

    // Use terrain to generate nodes
    // Use adjacency matrix to generate edges
    return (
      <Flowspace selected={this.props.selectedZone}>{flowpoints}</Flowspace>
    );
  }
}
