import React from 'react';
import ReactDOM from 'react-dom';
import { ScenarioSpec } from './components/ScenarioSpec';
import * as serviceWorker from './serviceWorker';
import {ThemeProvider} from 'emotion-theming';
import theme from '@rebass/preset'

ReactDOM.render(<ThemeProvider theme={theme}>
    <ScenarioSpec />
  </ThemeProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
