import React from "react";
import { Link as A, useHistory } from "react-router-dom";
import { makeStyles, Typography } from "@material-ui/core";
import { Box, Link, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	title: {
		background: theme.palette.secondary.light,
		color: theme.palette.secondary.contrastText,
		borderRadius: "0.25rem 0.25rem 0 0",
		textAlign: "center",
		padding: "0.5rem",
		margin: "-1rem -1rem 1rem -1rem"
	},
	wrapper: {
		background: theme.palette.primary.light,
		color: theme.palette.primary.contrastText,
		borderRadius: "0.25rem",
		padding: "1rem",
		margin: "1rem 0"
	},
	info: {
		textAlign: "center",
		textTransform: "unset",
		width: "100%",
		marginBottom: "1rem",
		fontSize: "1.8rem",
		padding: "1rem",
		background: theme.palette.secondary.dark,
		color: theme.palette.secondary.contrastText,
		borderRadius: "0.25rem",
		"& a": {
			color: "inherit"
		},
		"&:hover": {
			background: theme.palette.secondary.main
		}
	}
}));

/**
 * A title component built around Material UI's `<Typography/>`. By default an h1 but h2 sizing.
 * @param {import("@material-ui/core").TypographyProps} [props]
 * @param {"h1" | "h2" | "h3" | "h4" | "h5" | "h6"} [options.component]
 * @param {"h1" | "h2" | "h3" | "h4" | "h5" | "h6"} [options.variant]
 */
export const Title = (props) => {
	const { component, variant } = props;
	const { title } = useStyles();
	return (
		<Typography
			component={component || "h1"}
			variant={variant || "h2"}
			className={title}
			{...props}
		/>
	);
};

/**
 * Simple styled Material UI `<Box/>` that uses the primary main color and has border radius of 0.25rem.
 * Takes all the same props as `<Box/>`.
 * @param {import("@material-ui/core").BoxProps} [props]
 */
export const Wrapper = (props) => {
	const classes = useStyles();
	return <Box {...props} className={classes.wrapper} />;
};

/**
 *
 * @param {Object} props
 * @param {string} props.to
 * @param {any} props.children
 * @param {boolean} [props.fullSizeInfo]
 * @param {import("@material-ui/core").ButtonBaseTypeMap} [props.other]
 */
export const ButtonLink = (props) => {
	const { to, fullSizeInfo, other } = props;
	const history = useHistory();
	const classes = useStyles();
	return (
		<Button
			{...other}
			onClick={() => history.push(to)}
			className={fullSizeInfo ? classes.info : ""}>
			<Link to={to} component={A}>
				{props.children}
			</Link>
		</Button>
	);
};

export { Alert } from "./Alert";
