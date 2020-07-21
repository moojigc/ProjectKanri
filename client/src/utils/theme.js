import { createMuiTheme } from "@material-ui/core";

const theme = (lightMode) =>
	createMuiTheme({
		palette: {
			type: lightMode ? "light" : "dark",
			background: {
				default: lightMode ? "rgb(255, 245, 245)" : "rgb(25, 26, 27)",
				paper: lightMode ? "rgb(252, 221, 242)" : "rgb(50,50,50)"
			},
			primary: {
				main: lightMode ? "rgb(255, 196, 236)" : "rgb(97, 108, 153)"
			},
			secondary: {
				main: lightMode ? "rgb(97, 108, 153)" : "rgb(90, 90, 90)"
			},
			kone: {
				light: lightMode ? "rgb(255, 245, 245)" : "rgb(135, 134, 134)"
			}
		}
	});

export default theme;
