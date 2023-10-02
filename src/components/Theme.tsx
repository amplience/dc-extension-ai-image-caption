import { CssBaseline } from "@mui/material";

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";

const theme = extendTheme({
  typography: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12,
    caption: {
      fontSize: 11,
    },
  },
  colorSchemes: {
    light: {
      palette: {
        text: {
          primary: "rgb(51, 51, 51)",
        },
        primary: {
          50: "#039be5",
          100: "#039be5",
          200: "#039be5",
          300: "#039be5",
          400: "#039be5",
          500: "#039be5",
          600: "#039be5",
          700: "#039be5",
          800: "#039be5",
          900: "#039be5",
          A100: "#039be5",
          A200: "#039be5",
          A400: "#039be5",
          A700: "#039be5",
        },
        grey: {
          300: "#c9cccf",
        },
        error: {
          main: "rgb(221,44,0)",
        },
      },
    },
  },
  components: {
    MuiInput: {
      styleOverrides: {
        underline: {
          "&:after": {
            transition: "unset",
          },
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          "&$error": {
            color: undefined,
          },
          "&$focused": {
            color: undefined,
          },
        },
      },
    },
  },
});

function Theme({ children }) {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}

export default Theme;
