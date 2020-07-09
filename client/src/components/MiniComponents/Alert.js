import React from "react";
import { makeStyles, Box } from "@material-ui/core";

/**
 * Alerts the user to a success or failure
 * @param {Object} props
 * @param {"error" | "success"} props.type
 * @param {any} props.children
 * @param {import("@material-ui/core").BoxProps} [props.other]
 */
export const Alert = (props) => {
	const { type, other } = props;
	const useStyles = makeStyles((theme) => ({
		alert: {
			background:
				type === "success" ? theme.palette.success.light : theme.palette.error.light,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			fontSize: "1.5rem",
			padding: "1rem",
			borderRadius: "0.25rem",
			color:
				type === "success"
					? theme.palette.success.contrastText
					: theme.palette.error.contrastText
		}
	}));
	const classes = useStyles();
	return (
		<Box {...other} className={classes.alert}>
			{props.children}
		</Box>
	);
};
