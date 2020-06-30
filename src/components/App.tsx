import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box } from 'rebass';
import { EnemySet } from '../simulator/scenario';
import { TerrainExposed } from '../map/terrain';
import { ZoneSpec } from './zoneSpec';

// Player specs across the top, w/ plus button for adding more players
// Zone layout/connections on the left
// Zone spec on the right for the selected zone

function App() {
  return (
    <Box
      sx={{
        p: 4,
        color: 'text',
        bg: 'background',
        fontFamily: 'body',
        fontWeight: 'body',
        lineHeight: 'body',
      }}>
        < ZoneSpec
          zone={0}
          playerNames={['Jerry', 'Linda']}
          enemySet={new EnemySet(6, 0, 0, 0)}
          terrain={TerrainExposed}
          zonesConnectedTo={[1, 2]}
        />
      </Box>
  );
}

export default App;
