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
import { FaceSharp } from "@material-ui/icons";

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
	const handleSetUserDetails = ({ target }) => {
		const { name, value } = target;
		setUserDetails({
			...userDetails,
			[name]: value
		});
	};
	useEffect(() => {
		// setFlash({ message: "test", type: "info" });
		setFlash({ message: null, type: null });
	}, []);
	return (
		<Container maxWidth="md" component="main">
			<Wrapper padding="2rem">
				<Title>Sign Up</Title>
				<form onSubmit={handleRegister}>
					<Grid container justify="center" spacing={2}>
						{flash.message ? (
							<Grid item container xs={12} justify="center">
								<Alert severity={flash.type}>{flash.message}</Alert>
							</Grid>
						) : null}
						<Grid item container spacing={2}>
							<Grid
								item
								xs={12}
								container
								spacing={1}
								justify="center"
								alignItems="flex-end">
								<Grid item xs={12}>
									<TextField
										required
										onChange={handleSetUserDetails}
										name="firstName"
										fullWidth
										type="text"
										color="secondary"
										id="first-name"
										variant="standard"
										label="First Name"
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item container spacing={2}>
							<Grid
								item
								xs={12}
								container
								spacing={1}
								justify="center"
								alignItems="flex-end">
								<Grid item xs={12}>
									<TextField
										required
										onChange={handleSetUserDetails}
										name="lastName"
										fullWidth
										type="text"
										color="secondary"
										id="last-name"
										variant="standard"
										label="Last Name"
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item container spacing={2}>
							<Grid
								item
								xs={12}
								container
								spacing={1}
								justify="center"
								alignItems="flex-end">
								<Grid item>
									<Email />
								</Grid>
								<Grid item xs={10}>
									<TextField
										required={!user.email}
										onChange={handleSetUserDetails}
										name="email"
										fullWidth
										type="email"
										color="secondary"
										id="email"
										variant="standard"
										label="Email"
										placeholder={user.email}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item container spacing={2}>
							<Grid
								item
								xs={12}
								container
								spacing={1}
								justify="center"
								alignItems="flex-end">
								<Grid item>
									<FaceSharp />
								</Grid>
								<Grid item xs={10}>
									<TextField
										required
										onChange={handleSetUserDetails}
										name="username"
										fullWidth
										type="text"
										color="secondary"
										id="username"
										variant="standard"
										label="Username"
									/>
								</Grid>
							</Grid>
						</Grid>

						<Grid item container spacing={2}>
							<Grid
								item
								xs={12}
								container
								spacing={1}
								justify="center"
								alignItems="flex-end">
								<Grid item>
									<Lock />
								</Grid>
								<Grid item xs={10}>
									<TextField
										required
										onChange={handleSetUserDetails}
										name="password"
										fullWidth
										type="text"
										color="secondary"
										id="password"
										variant="standard"
										label="Password"
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item container spacing={2}>
							<Grid
								item
								xs={12}
								container
								spacing={1}
								justify="center"
								alignItems="flex-end">
								<Grid item>
									<Lock />
								</Grid>
								<Grid item xs={10}>
									<TextField
										required
										onChange={handleSetUserDetails}
										name="password2"
										fullWidth
										type="text"
										color="secondary"
										id="confirm-password"
										variant="standard"
										label="Confirm Password"
									/>
								</Grid>
							</Grid>
						</Grid>

						<Grid container justify="center">
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
						</Grid>
					</Grid>
				</form>
			</Wrapper>
			<ButtonLink to="/login" color="secondary" fullWidth variant="contained">
				Have an account? Login here.
			</ButtonLink>
		</Container>
	);
};

export default Register;
