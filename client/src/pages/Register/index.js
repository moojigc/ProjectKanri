// @ts-check
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/EmailOutlined";
import Lock from "@material-ui/icons/Lock";
import Send from "@material-ui/icons/Send";
import userAPI from "../../utils/userAPI";
import FormGroup from "@material-ui/core/FormGroup";
import { makeStyles } from "@material-ui/core";
import { FlashContext } from "../../utils/FlashContext";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import { UserContext } from "../../utils/UserContext";
import { Alert } from "@material-ui/lab";

const Register = () => {
	const { user } = useContext(UserContext);
	const [userDetails, setUserDetails] = useState({
		firstName: "",
		lastName: "",
		username: "",
		password: "",
		password2: "",
		email: user.email || ""
	});
	const history = useHistory();
	// @ts-ignore
	const { flash, setFlash } = useContext(FlashContext);
	const handleRegister = async (event) => {
		event.preventDefault();
		let res = await userAPI.register(userDetails);
		setFlash(res.flash);
		if (res.redirect === "/login") history.push(res.redirect);
	};

	useEffect(() => {
		setFlash({ message: null, type: null });
	}, []);
	return (
		<Container maxWidth="lg" component="main">
			<Wrapper padding="2rem">
				<Title>Sign Up</Title>
				<form onSubmit={handleRegister}>
					<Grid container>
						<Grid item sm={12}>
							<ButtonLink to="/login" info>
								Have an account? Login here.
							</ButtonLink>
						</Grid>
					</Grid>
					<Grid container spacing={1}>
						<Grid item container spacing={2}>
							<Grid item sm={12}>
								<TextField
									required={!user.email}
									onChange={({ target }) =>
										setUserDetails({
											...userDetails,
											lastName: target.value
										})
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Email />
											</InputAdornment>
										)
									}}
									fullWidth
									type="email"
									color="secondary"
									id="email"
									variant="filled"
									label="Email"
									placeholder={user.email}
								/>
							</Grid>
						</Grid>
						<Grid item container>
							<Grid item sm={12}>
								<TextField
									required
									onChange={({ target }) =>
										setUserDetails({
											...userDetails,
											username: target.value
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
									color="secondary"
									id="username"
									variant="filled"
									label="Username"
								/>
							</Grid>
						</Grid>
						<Grid item container spacing={1}>
							<Grid item sm={6}>
								<TextField
									required
									onChange={({ target }) =>
										setUserDetails({
											...userDetails,
											firstName: target.value
										})
									}
									fullWidth
									color="secondary"
									id="first-name"
									variant="filled"
									label="First Name"
								/>
							</Grid>
							<Grid item sm={6}>
								<TextField
									required
									onChange={({ target }) =>
										setUserDetails({
											...userDetails,
											lastName: target.value
										})
									}
									fullWidth
									color="secondary"
									id="last-name"
									variant="filled"
									label="Last Name"
								/>
							</Grid>
						</Grid>
						<Grid item container spacing={1}>
							<Grid item sm={6}>
								<TextField
									required
									onChange={({ target }) =>
										setUserDetails({
											...userDetails,
											password: target.value
										})
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Lock />
											</InputAdornment>
										)
									}}
									fullWidth
									color="secondary"
									id="password"
									variant="filled"
									type="password"
									label="Password"
								/>
							</Grid>
							<Grid item sm={6}>
								<TextField
									required
									onChange={({ target }) =>
										setUserDetails({
											...userDetails,
											password2: target.value
										})
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Lock />
											</InputAdornment>
										)
									}}
									fullWidth
									color="secondary"
									id="confirm-password"
									type="password"
									variant="filled"
									label="Confirm Password"
								/>
							</Grid>
						</Grid>
						<Grid item container>
							<Grid item>
								<FormGroup row>
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
					</Grid>
				</form>
			</Wrapper>
			{flash.message ? <Alert type={flash.type}>{flash.message}</Alert> : null}
		</Container>
	);
};

export default Register;
