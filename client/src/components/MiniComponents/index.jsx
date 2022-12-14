import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Typography } from "@material-ui/core";
import { Box, Button } from "@material-ui/core";
import sakuraBranch from "../../sakura_branch.png";
import sakuraFlipped from "../../sakura_flipped.png";
import clsx from "clsx";

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
		background: theme.palette.background.paper,
		color: theme.palette.getContrastText(theme.palette.background.paper),
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
		background: theme.palette.secondary.light,
		color: theme.palette.secondary.contrastText,
		borderRadius: "0.25rem",
		"&:hover": {
			background: theme.palette.secondary.main
		}
	}
}));

/**
 * A title component built around Material UI's `<Typography/>`. By default an h1 but h2 sizing.
 * **Must** go inside a `<Wrapper/>`.
 * @param {import("@material-ui/core").TypographyProps} [props]
 */
export const Title = (props) => {
	const { component, variant } = props;
	const { title } = useStyles();
	return <Typography component={component || "h1"} variant={variant || "h3"} className={clsx(title, "title")} {...props} />;
};

/**
 * Simple styled Material UI `<Box/>` that uses the primary main color and has border radius of 0.25rem.
 * Takes all the same props as `<Box/>`.
 * @param {import("@material-ui/core").BoxProps} [props]
 */
export const Wrapper = (props) => {
	const classes = useStyles();
	return <Box {...props} boxShadow={2} className={classes.wrapper} />;
};

/**
 * Button that takes a route as the `to` prop; e.g `to="/login"`
 * @param {Object} props
 * @param {string} props.to
 * @param {boolean} [props.info]
 * @param {any} props.children
 */
export const ButtonLink = ({ to, info, color, className, children, ...props }) => {
	const history = useHistory();
	const classes = useStyles();
	const handleClick = (event) => {
		event.preventDefault();
		history.push(to);
	};
	return (
		<Button color={color} href={to} onClick={handleClick} className={info ? classes.info : className} {...props}>
			<Typography>{children}</Typography>
		</Button>
	);
};

export const SakuraBranches = ({ zIndex, width, opacity }) => {
	return (
		<React.Fragment>
			<img style={{ zIndex: zIndex, width: width, opacity: opacity }} src={sakuraFlipped} alt="sakura branch" className="sakura-flipped" />
			<img style={{ zIndex: zIndex, width: width, opacity: opacity }} src={sakuraBranch} className="sakura-normal" alt="sakura branch" />
		</React.Fragment>
	);
};

export { default as Snackbar } from "./Snackbar";
