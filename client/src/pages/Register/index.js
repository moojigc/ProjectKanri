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
import { Alert, Title, Wrapper, ButtonLink } from "../../components/MiniComponents";

const useStyles = makeStyles((theme) => ({
	info: {
		background: theme.palette.info.light,
		color: theme.palette.info.contrastText,
		padding: "1rem",
		borderRadius: "0.25rem"
	}
}));

const Register = () => {
	const [userDetails, setUserDetails] = useState({
		username: "",
		password: "",
		password2: "",
		email: ""
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
			<Wrapper>
				<Title>Sign Up</Title>
				<form onSubmit={handleRegister}>
					<Grid container>
						<Grid item sm={12}>
							<ButtonLink to="/login" fullSizeInfo>
								Have an account? Login here.
							</ButtonLink>
						</Grid>
					</Grid>
					<Grid container justify="center" spacing={2}>
						<Grid item sm={12}>
							<TextField
								required
								onChange={({ target }) =>
									setUserDetails({
										...userDetails,
										email: target.value
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
								id="username-or-email"
								variant="filled"
								label="Email"
							/>
						</Grid>
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
								id="username-or-email"
								variant="filled"
								label="Username"
							/>
						</Grid>
						<Grid item sm={6}>
							<TextField
								required
								onChange={({ target }) =>
									setUserDetails({ ...userDetails, password: target.value })
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
								type="password"
								label="Password"
							/>
						</Grid>
						<Grid item sm={6}>
							<TextField
								required
								onChange={({ target }) =>
									setUserDetails({ ...userDetails, password2: target.value })
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
								label="Confirm Password"
							/>
						</Grid>
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
				</form>
			</Wrapper>
			{flash.message ? <Alert type={flash.type}>{flash.message}</Alert> : null}
		</Container>
	);
};

export default Register;
