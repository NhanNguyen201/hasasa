import { createTheme } from '@mui/material/styles';

// eslint-disable-next-line
export default createTheme({
  palette: {
      primary: {
          ligt: 'rgb(111, 192, 212)', // light blue
          main: 'rgb(39, 160, 190)', // blue
          dark: 'rgb(25, 154, 187)', // dark blue
          contrastText: '#fff'
      },
      secondary: {
          light: 'rgb(255, 189, 164)', // light orange
          main: 'rgb(255, 113, 61)', // orange
          dark: 'rgb(255, 76, 10)',  // dark orange
          contrastText: '#fff'
      },
      contrastColor: {
          main: "#ffffff"
      },

  },
  typography: {
      useNextVariants: true
  }
})