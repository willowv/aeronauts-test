import * as React from "react";
import { CombatMap } from "../simulation/map/map";
import { Box, Heading, Card } from "rebass";
import { Flowpoint, Flowspace } from "flowpoints";
import { ScenarioPlayer, ScenarioEnemySet } from "../simulation/scenario";
import { EnemyType } from "../enum";

interface MapVisProps {
  map: CombatMap;
  players: ScenarioPlayer[];
  enemySetByZone: ScenarioEnemySet[];
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
const horizontalSpacing = 240;
const margins = 20;

export const MapVis = ({
  map,
  players,
  selectedZone,
  setSelectedZone,
  enemySetByZone,
}: MapVisProps) => {
  let flowpoints: JSX.Element[] = map.zoneNames.map((name, zone) => {
    let x = map.positioning[zone].x * horizontalSpacing + margins;
    let y = map.positioning[zone].y * verticalSpacing + margins;
    let outputs = map
      .ZonesMovableFrom(zone)
      .filter((zoneDest) => zoneDest > zone); // don't add repeat edges
    let players2 = players.filter((player) => player.zone === zone);
    let npcSet = enemySetByZone[zone];

    let enemyBadges = (
      <>
        {/* Render a badge if the count is greater than 0. Otherwise render false (nothing) */}
        {npcSet.countByCombatantType[EnemyType.Normal] > 0 && (
          <Box sx={NpcBadgeStyle}>
            {"N: " + npcSet.countByCombatantType[EnemyType.Normal]}
          </Box>
        )}
        {npcSet.countByCombatantType[EnemyType.Dangerous] > 0 && (
          <Box sx={NpcBadgeStyle}>
            {"D: " + npcSet.countByCombatantType[EnemyType.Dangerous]}
          </Box>
        )}
        {npcSet.countByCombatantType[EnemyType.Tough] > 0 && (
          <Box sx={NpcBadgeStyle}>
            {"T: " + npcSet.countByCombatantType[EnemyType.Tough]}
          </Box>
        )}
        {npcSet.countByCombatantType[EnemyType.Scary] > 0 && (
          <Box sx={NpcBadgeStyle}>
            {"S: " + npcSet.countByCombatantType[EnemyType.Scary]}
          </Box>
        )}
      </>
    );

    let style = selectedZone === zone ? ZoneSelected : ZoneStyle;
    return (
      <Flowpoint
        key={zone}
        outputs={outputs}
        startPosition={{ x: x, y: y }}
        width={200}
        onClick={() => {
          setSelectedZone(zone);
        }}
      >
        <Card sx={style}>
          <Heading as="h3">{name}</Heading>
          {players2.map((player, index) => (
            <Box key={index} sx={PlayerBadgeStyle}>
              {player.name}
            </Box>
          ))}
          {enemyBadges}
        </Card>
      </Flowpoint>
    );
  });

  // Use terrain to generate nodes
  // Use adjacency matrix to generate edges
  return <Flowspace selected={selectedZone}>{flowpoints}</Flowspace>;
};
