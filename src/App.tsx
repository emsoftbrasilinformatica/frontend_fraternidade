import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import GlobalStyles from './styles/global';

import AppProvider from './hooks';
import Routes from './routes';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0f5e9e',
    },
    secondary: {
      main: '#0f5e9e',
    },
  },
});

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <Routes />
        </ThemeProvider>
      </AppProvider>

      <GlobalStyles />
    </Router>
  );
};

export default App;
