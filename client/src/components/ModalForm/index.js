import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, Button, Typography, Grid, useMediaQuery } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { SendOutlined } from "@material-ui/icons";

/**
 *
 * @param {Object} props
 * @param {boolean} props.noSubmitButton
 * @param {boolean} props.open
 * @param {Function} props.setOpen
 * @param {Function} props.onFormSubmit
 * @param {{message, type}} props.flash
 * @param {string} props.information
 * @param {import('react').FunctionComponent[]} props.TextFields
 * @param {import("react").CSSProperties} props.BoxStyle
 */
const ModalForm = ({
	noSubmitButton,
	open,
	setOpen,
	onFormSubmit,
	flash,
	information,
	TextFields,
	labelledby,
	describedby,
	BoxStyle,
	otherButtons
}) => {
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
			color: BoxStyle.color || theme.palette.getContrastText(theme.palette.background.paper),
			// "& *": {
			// },
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
	const classes = useStyles();
	const mobile = useMediaQuery("(max-width: 960px)");

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
			}}
		>
			<Fade in={open}>
				<Box style={BoxStyle} className={classes.paper}>
					<form style={{ width: "100%" }} onSubmit={onFormSubmit} className={classes.form}>
						{information ? (
							<Grid container justify="center">
								{flash.type === "success" ? (
									<Alert severity="success">{flash.message}</Alert>
								) : (
									<Alert severity="info">{information}</Alert>
								)}
							</Grid>
						) : null}
						{TextFields.map((t, i) => {
							return <Grid key={i} container>{t}</Grid>;
						})}
						{!noSubmitButton && (
							<Grid container justify="center">
								<Button endIcon={<SendOutlined />} type="submit" variant="contained" color="secondary">
									<Typography style={{ color: "white" }}>Submit</Typography>
								</Button>
								{otherButtons?.length && otherButtons.map((button) => button)}
							</Grid>
						)}
					</form>
				</Box>
			</Fade>
		</Modal>
	);
};

export default ModalForm;
