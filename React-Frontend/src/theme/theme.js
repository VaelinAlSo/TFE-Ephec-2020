import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

let theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 980,
      lg: 1280,
      xl: 1980,
    },
  },

  palette: {
    /* background: {
      default: "#222222",
    },*/
    primary: {
      main: "#37474f",
    },
    secondary: {
      main: "#fafafa",
      dark: "#212121",
      light: "#ffffff",
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
