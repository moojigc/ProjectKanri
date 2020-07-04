import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import Face from "@material-ui/icons/Face";
import Lock from "@material-ui/icons/Lock";
import Send from "@material-ui/icons/Send";
import userApi from "../../utils/userAPI";
import Wrapper from "../../components/Wrapper";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useUserContext } from "../../utils/UserContext";

const Login = () => {
	const [loginDetails, setLoginDetails] = useState({
		usernameOrEmail: "",
		password: "",
		rememberMe: false
	});
	const [flash, setFlash] = useState(null);
	const [user, dispatchUser] = useUserContext();
	const handleLogin = async () => {
		let res = await userApi({
			action: "login",
			userDetails: loginDetails
		});
		console.log(res);
		dispatchUser({ user: res.user });
		setFlash(res.flash);
	};
	useEffect(() => {
		console.log(user);
	}, [user]);
	return (
		<Container maxWidth="lg" component="main">
			<h1 className="heading">Login</h1>
			<Wrapper>
				<form>
					<Grid container justify="center" spacing={2}>
						<Grid item sm={12}>
							<TextField
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
						<Grid item sm={12}>
							<TextField
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
									onClick={handleLogin}
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
			{flash ? (
				// Temporary
				<Wrapper style={{ marginTop: "1rem", borderRadius: "0.25rem" }}>
					{flash.message}
				</Wrapper>
			) : null}
		</Container>
	);
};

export default Login;
