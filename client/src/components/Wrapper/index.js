import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles((theme) => ({
	wrapper: {
		background: theme.palette.primary.main,
		borderRadius: "0.25rem",
		padding: "1rem",
		margin: "1rem 0"
	}
}));
/**
 *
 * @param {Object} o
 * @param {any} [o.children]
 * @param {import("react").HTMLProps} [o.props]
 */
const Wrapper = ({ children, ...props }) => {
	const styles = useStyle();
	return (
		<div className={styles.wrapper} {...props}>
			{children}
		</div>
	);
};

export default Wrapper;
