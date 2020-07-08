import React from "react";
import { makeStyles } from "@material-ui/core";

/**
 * Alerts the user to a success or failure
 * @param {Object} o
 * @param {any} o.children
 * @param {"error" | "success"} o.type
 * @param {import("react").ReactPropTypes} [o.props]
 */
const Alert = ({ children, type, ...props }) => {
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
		<div {...props} className={classes.alert}>
			{children}
		</div>
	);
};

export default Alert;
