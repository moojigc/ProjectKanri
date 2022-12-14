import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, TextField, Button, Typography, Grid, InputAdornment } from "@material-ui/core";
import userAPI from "../../utils/userAPI";
import { Alert } from "@material-ui/lab";
import { EmailOutlined, SendOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	paper: {
		backgroundColor: theme.palette.primary.light,
		border: "unset",
		borderRadius: "0.25rem",
		color: theme.palette.info.contrastText,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		"& button, input, label": {
			color: theme.palette.primary.contrastText
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

const ForgotModal = ({ open, setOpen }) => {
	const [email, setEmail] = useState("");
	const [flash, setFlash] = useState({ message: "", type: "" });

	const handleForgotPassword = async (event) => {
		event.preventDefault();
		try {
			let res = await userAPI.sendResetEmail(email);
			setFlash(res.flash);
		} catch (error) {
			console.error(error);
			setFlash({ message: "Bad request", type: "error" });
		}
	};
	const classes = useStyles();
	useEffect(() => {
		// cleanup
		return () => {
			setFlash({});
			setEmail("");
		};
	}, []);

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
					<form
						onSubmit={(event) => handleForgotPassword(event, email)}
						className={classes.form}>
						<Grid container>
							{flash.type === "success" ? (
								<Alert severity="success">{flash.message}</Alert>
							) : (
								<Alert severity="info">
									Once you click submit, you should receive an email within a few
									minutes from <strong>{"<projectkanriteam@gmail.com>"}</strong>{" "}
									with a secure link to reset your password.
								</Alert>
							)}
						</Grid>
						<Grid container>
							<TextField
								error={flash.type === "error"}
								type="email"
								helperText={flash.type === "error" ? flash.message : ""}
								FormHelperTextProps={{ className: classes.helperText }}
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment>
											<EmailOutlined />
										</InputAdornment>
									)
								}}
								variant="outlined"
								id="enter-email-address"
								onChange={({ target }) => setEmail(target.value)}
								label="Enter email address"
							/>
						</Grid>
						<Grid container justify="center">
							<Button
								text
								endIcon={<SendOutlined />}
								type="submit"
								variant="contained"
								color="secondary">
								<Typography style={{ color: "white" }}>Submit</Typography>
							</Button>
						</Grid>
					</form>
					{/* {flash.type === "success" ? (
						<Alert style={{ marginTop: "1rem" }} severity={flash.type}>
							{flash.message}
						</Alert>
					) : null} */}
				</Box>
			</Fade>
		</Modal>
	);
};

export default ForgotModal;
