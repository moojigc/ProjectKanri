import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, TextField, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	paper: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		"& *": {
			color: theme.palette.primary.contrastText
		}
	}
}));

const ForgotModal = ({ open, setOpen, handleForgotPassword }) => {
	const classes = useStyles();

	return (
		<Modal
			aria-labelledby="transition-modal-forgot-password"
			aria-describedby="transition-modal-send-reset-password-to-your-email"
			className={classes.modal}
			open={open}
			onClose={() => setOpen(false)}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500
			}}>
			<Fade in={open}>
				<Box className={classes.paper}>
					<form onSubmit={handleForgotPassword}>
						<TextField fullWidth label="Enter email address" />
						<Button type="submit" variant="contained" color="primary">
							Submit
						</Button>
					</form>
				</Box>
			</Fade>
		</Modal>
	);
};

export default ForgotModal;
