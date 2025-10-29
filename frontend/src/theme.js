import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1877F2' }, // bleu Facebook
    secondary: { main: '#4267B2' }, // bleu plus foncé (ancien style Facebook)
    background: {
      default: '#f0f2f5', // fond général clair (gris très pâle)
      paper: '#ffffff',   // cartes, sections, etc.
    },
    text: {
      primary: '#050505', // texte principal noir doux
      secondary: '#65676B', // texte secondaire gris
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
        containedPrimary: {
          color: '#fff',
          backgroundColor: '#1877F2',
          '&:hover': {
            backgroundColor: '#166FE5',
          },
        },
      },
    },
  },
});

export default theme;
