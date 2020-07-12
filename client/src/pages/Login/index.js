import React, { useEffect, useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import HelpOutline from "@material-ui/icons/HelpOutline";
import Face from "@material-ui/icons/Face";
import Lock from "@material-ui/icons/Lock";
import Send from "@material-ui/icons/Send";
import userAPI from "../../utils/userAPI";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { UserContext } from "../../utils/UserContext";
import { FlashContext } from "../../utils/FlashContext";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";

const useStyles = makeStyles((theme) => ({
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

const Login = () => {
	const [loginDetails, setLoginDetails] = useState({
		usernameOrEmail: "",
		password: "",
		rememberMe: false
	});
	const { flash, setFlash } = useContext(FlashContext);
	const { setUser } = useContext(UserContext);
	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			let res = await userAPI.login(loginDetails);
			console.log(res);
			setUser(res.user);
			setFlash(res.flash);
		} catch (error) {
			console.error(error);
			setFlash({ message: "Sorry, an error has occurred.", type: "error" });
		}
	};
	const handleForgotPassword = async () => {
		try {
			let res = await userAPI.sendResetEmail(loginDetails.usernameOrEmail);
			setFlash(res.flash);
			console.log(res);
		} catch (error) {
			console.error(error);
		}
	};
	const history = useHistory();
	useEffect(() => {
		return () => setFlash({ message: null, type: null });
	}, []);
	return (
		<Container maxWidth="lg" component="main">
			<Wrapper>
				<Title>Login</Title>
				<form onSubmit={handleLogin}>
					<Grid container>
						<Grid item sm={12}>
							<ButtonLink to="/signup" info>
								First time user? Sign up here.
							</ButtonLink>
						</Grid>
					</Grid>
					<Grid container justify="center" spacing={2}>
						<Grid item md={6}>
							<TextField
								required
								onChange={({ target }) =>
									setLoginDetails({
										...loginDetails,
										usernameOrEmail: target.value
									})
								}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Face />
										</InputAdornment>
									)
								}}
								fullWidth
								id="username-or-email"
								variant="filled"
								label="Username/Email"
							/>
						</Grid>
						<Grid item md={6}>
							<TextField
								required
								onChange={({ target }) =>
									setLoginDetails({ ...loginDetails, password: target.value })
								}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Lock />
										</InputAdornment>
									)
								}}
								fullWidth
								id="password"
								type="password"
								variant="filled"
								label="Password"
							/>
						</Grid>
						<Grid item>
							<FormGroup row>
								<FormControlLabel
									control={
										<Switch
											checked={loginDetails.rememberMe}
											onChange={({ target }) =>
												setLoginDetails({
													...loginDetails,
													rememberMe: target.checked
												})
											}
										/>
									}
									label="Remember me?"
								/>
							</FormGroup>
							<FormGroup row>
								<Button
									type="button"
									style={{ marginTop: "1rem" }}
									variant="contained"
									size="large"
									onClick={handleForgotPassword}>
									Forgot Password?
									<InputAdornment position="end">
										<HelpOutline />
									</InputAdornment>
								</Button>
								<Button
									type="submit"
									style={{ marginTop: "1rem" }}
									variant="contained"
									size="large">
									Submit
									<InputAdornment position="end">
										<Send />
									</InputAdornment>
								</Button>
							</FormGroup>
						</Grid>
					</Grid>
				</form>
			</Wrapper>
			{flash.message ? <Alert severity={flash.type}>{flash.message}</Alert> : null}
		</Container>
	);
};

export default Login;
