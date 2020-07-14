//@ts-check
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
import { makeStyles, Box } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import ForgotModal from "../../components/ForgotModal";

const Login = () => {
	const history = useHistory();

	const [modalOpen, setModalOpen] = useState(false);
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
			setUser(res.user);
			setFlash(res.flash);
			if (res.user.auth) history.push("/");
		} catch (error) {
			console.error(error);
			setFlash({ message: "Sorry, an error has occurred.", type: "error" });
		}
	};

	useEffect(() => {
		return () => setFlash({ message: null, type: null });
	}, []);
	return (
		<React.Fragment>
			<ForgotModal open={modalOpen} setOpen={setModalOpen} />
			<Container maxWidth="lg" component="main">
				<Wrapper>
					<Title>Login</Title>
					<form onSubmit={handleLogin}>
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
						</Grid>
						<Grid container justify="center">
							<FormGroup row style={{ marginTop: "1rem" }}>
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
						</Grid>
						<Grid container justify="center">
							<Button
								color="primary"
								type="button"
								style={{ marginTop: "1rem" }}
								variant="contained"
								size="small"
								onClick={() => setModalOpen(true)}>
								Forgot Password?
								<InputAdornment position="end">
									<HelpOutline />
								</InputAdornment>
							</Button>
						</Grid>
						<Grid container justify="center">
							<Box display="flex" justifyContent="center">
								<Button
									color="secondary"
									type="submit"
									style={{ marginTop: "1rem" }}
									variant="contained"
									size="large">
									Submit
									<InputAdornment position="end">
										<Send />
									</InputAdornment>
								</Button>
							</Box>
						</Grid>
					</form>
				</Wrapper>
				<Grid container>
					<Grid item sm={12}>
						<ButtonLink to="/signup" info>
							First time user? Sign up here.
						</ButtonLink>
					</Grid>
				</Grid>
				{flash.message ? <Alert severity={flash.type}>{flash.message}</Alert> : null}
			</Container>
		</React.Fragment>
	);
};

export default Login;
