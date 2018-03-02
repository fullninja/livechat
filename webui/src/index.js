import React from 'react';
import ReactDOM from 'react-dom';

import './styles/index.css';
import App from './App';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import green from 'material-ui/colors/green';
import registerServiceWorker from './registerServiceWorker';

const theme = createMuiTheme({
    palette: {
      primary: blue,
      secondary: green,
    }
});

ReactDOM.render((
  <MuiThemeProvider theme={ theme }>
    <App />
  </MuiThemeProvider>
), document.getElementById('root'));
registerServiceWorker();
