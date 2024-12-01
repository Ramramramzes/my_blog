import { createTheme, ThemeOptions } from '@mui/material/styles';

const lightOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Montserrat Alternates',
    fontWeightLight: 400,
    h1: {
      fontFamily: 'Amatic SC, cursive',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Amatic SC, cursive',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Amatic SC, cursive',
      fontWeight: 700,
    },
    button: {
      fontFamily: 'Comfortaa',
    },
    overline: {
      fontFamily: 'Comfortaa',
    },
    caption: {
      fontFamily: 'Comfortaa',
    },
    body2: {
      fontFamily: 'Montserrat Alternates',
    },
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 46,
          height: 27,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&$checked, &$colorPrimary$checked, &$colorSecondary$checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + $track': {
              opacity: 1,
              border: 'none',
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #bdbdbd',
          backgroundColor: '#fafafa',
          opacity: 1,
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
  },
};


const darkOptions: ThemeOptions = {
  ...lightOptions,
  palette: {
    ...lightOptions.palette,
    mode: 'dark',
    primary: {
      main: '#bb86fc',
    },
    background: {
      default: '#333',
      paper: '#333',
    },
  },
};

export const light = createTheme(lightOptions);
export const dark = createTheme(darkOptions);