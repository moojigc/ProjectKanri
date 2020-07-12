import { createMuiTheme } from "@material-ui/core";

const theme = (darkMode) =>
	createMuiTheme({
		palette: {
			background: {
				default: darkMode ? "rgb(50, 50, 50)" : "rgb(255, 245, 245)"
			},
			primary: {
				type: darkMode ? "dark" : "light",
				main: darkMode ? "rgb(60, 60, 60)" : "rgb(252, 221, 242)"
			},
			secondary: {
				main: darkMode ? "rgb(166, 62, 130)" : "rgb(97, 108, 153)"
			}
		}
	});

export default theme;
