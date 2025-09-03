import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#928dab' },
    secondary: { main: '#1f1c2c' },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
  },
});

export default theme;

