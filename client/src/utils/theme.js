import { createMuiTheme } from "@material-ui/core";

const theme = (darkMode) =>
	createMuiTheme({
		palette: {
			type: darkMode ? "dark" : "light",
			background: {
				default: darkMode ? "rgb(25, 26, 27)" : "rgb(255, 245, 245)",
				paper: darkMode ? "rgb(50,50,50)" : "rgb(252, 221, 242)"
			},
			primary: {
				main: darkMode ? "rgb(97, 108, 153)" : "rgb(255, 196, 236)"
			},
			secondary: {
				main: darkMode ? "rgb(90, 90, 90)" : "rgb(97, 108, 153)"
			},
			kone: {
				light: darkMode ? "rgb(135, 134, 134)" : "rgb(255, 245, 245)"
			}
		}
	});

export default theme;
