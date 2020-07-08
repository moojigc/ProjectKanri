import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	title: {
		background: theme.palette.secondary.light,
		borderRadius: "0.25rem 0.25rem 0 0",
		textAlign: "center",
		padding: "0.5rem",
		margin: "-1rem -1rem 1rem -1rem"
	}
}));

/**
 * A title component built around Material UI's Typography. By default an h1 but h2 sizing
 * @param {Object} o
 * @param {any} children
 * @param {"h1" | "h2" | "h3" | "h4" | "h5" | "h6"} [o.h]
 */
const Title = ({ h, children }) => {
	const { title } = useStyles();
	return (
		<Typography component={h || "h1"} variant="h2" className={title}>
			{children}
		</Typography>
	);
};

export default Title;
