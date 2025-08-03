// src/theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { red } from '@mui/material/colors'

export const getTheme = (mode: 'light' | 'dark' = 'light') => {
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#C8102E', // UC Red
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#000000', // Black
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#121212',
        paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#ffffff',
        secondary: '#C8102E',
      },
      error: {
        main: red.A400,
      },
    },
    typography: {
      fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            ':focus-visible': {
              outline: '2px solid #C8102E',
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#C8102E',
            },
          },
        },
      },
    },
  })

  return responsiveFontSizes(theme)
}
