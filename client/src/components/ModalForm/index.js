import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, Button, Typography, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { SendOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "unset",
		borderRadius: "0.25rem",
		color: theme.palette.info.contrastText,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		"& button, input, label": {
			color: theme.palette.getContrastText(theme.palette.background.paper)
		},
		"&:focus": {
			border: "inital"
		}
	},
	form: {
		"& > div:not(:last-of-type)": {
			marginBottom: "1rem"
		}
	},
	helperText: {
		color: "initial"
	}
}));

/**
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.setOpen
 * @param {Function} props.onFormSubmit
 * @param {{message, type}} props.flash
 * @param {string} props.information
 * @param {import('react').FunctionComponent[]} props.TextFields
 * @param {import("react").CSSProperties} props.style
 */
const ModalForm = ({
	open,
	setOpen,
	onFormSubmit,
	flash,
	information,
	TextFields,
	labelledby,
	describedby,
	BoxStyle
}) => {
	const classes = useStyles();
	return (
		<Modal
			aria-labelledby={"transition-modal-" + labelledby}
			aria-describedby={"transition-modal-" + describedby}
			className={classes.modal}
			open={open}
			onClose={() => setOpen(false)}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500
			}}>
			<Fade in={open}>
				<Box style={BoxStyle} className={classes.paper}>
					<form onSubmit={onFormSubmit} className={classes.form}>
						{information ? (
							<Grid container justify="center">
								{flash.message ? (
									<Alert severity={flash.type}>{flash.message}</Alert>
								) : (
									<Alert severity="info">{information}</Alert>
								)}
							</Grid>
						) : null}
						{TextFields.map((t) => {
							return <Grid container>{t}</Grid>;
						})}
						<Grid container justify="center">
							<Button
								text
								endIcon={<SendOutlined />}
								type="submit"
								variant="contained"
								color="secondary">
								<Typography style={{ color: "white" }}>Submit</Typography>
							</Button>
							{otherButtons.length && otherButtons.map((button) => button)}
						</Grid>
					</form>
				</Box>
			</Fade>
		</Modal>
	);
};

export default ModalForm;
