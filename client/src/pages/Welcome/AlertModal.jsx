import React from "react";
import { Modal, Fade, Box, makeStyles, Divider, Grid, Button, Backdrop } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ButtonLink } from "../../components/MiniComponents";

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	paper: {
		maxWidth: "90vw",
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

export default function AlertModal({ open, setOpen, message, severity }) {
	const classes = useStyles();
	return (
		<Modal
			aria-labelledby="transition-modal-alert"
			aria-describedby="transition-modal-signup-alert"
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
				<Box className={classes.paper}>
					<Alert severity={severity}>{message}</Alert>
					<Divider />
					<Grid style={{ marginTop: "0.5rem" }} container alignItems="center" justify="flex-end">
						<Button onClick={() => setOpen(false)}>Dismiss</Button>
						{severity !== "error" && (
							<ButtonLink variant="contained" color="secondary" to="/login">
								Login
							</ButtonLink>
						)}
					</Grid>
				</Box>
			</Fade>
		</Modal>
	);
}
