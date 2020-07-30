import React, { useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import userAPI from "../../utils/userAPI";
import { FlashContext } from "../../utils/FlashContext";
import { useHistory } from "react-router-dom";
import { makeStyles, Box, Typography, useMediaQuery } from "@material-ui/core";
import { ButtonLink, SakuraBranches } from "../../components/MiniComponents";
import { ArrowForward, Send } from "@material-ui/icons";
import AlertModal from "./AlertModal";
import { UserContext } from "../../utils/UserContext";

const useStyles = makeStyles((theme) => ({
	welcome: {
		background: "linear-gradient(159deg, rgba(255,222,222,1) 0%, rgba(97,108,153,1) 100%)",
		width: "100vw",
		height: window.innerHeight,
		padding: "2rem"
	}
}));

const Welcome = () => {
	const history = useHistory();
	const [continueSignUp, setContinue] = useState(false);
	const [valid, setValid] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const isMobile = useMediaQuery("(max-width: 997px)");
	const [signUpDetails, setSignUpDetails] = useState({
		username: "",
		password: "",
		password2: "",
		firstName: "",
		lastName: "",
		email: ""
	});
	const { setUser } = useContext(UserContext);
	const { flash, setFlash } = useContext(FlashContext);
	const handleChangeUserDetails = ({ target }) => {
		let { name, value } = target;
		setSignUpDetails({
			...signUpDetails,
			[name]: value
		});
		if (Object.values(signUpDetails).filter((s) => !s).length === 0) {
			setValid(true);
		}
	};
	const classes = useStyles();
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (Object.values(signUpDetails).filter((s) => !s).length === 0) {
			let res = await userAPI.register(signUpDetails);
			setFlash(res.flash);
			setOpenModal(true);
		} else {
			setContinue(true);
		}
	};
	const handleDemoLogin = async () => {
		let res = await userAPI.login({ usernameOrEmail: "guest", password: "password" });
		setUser(res.user);
		history.push("/dashboard");
	};
	return (
		<Container maxWidth="xl" disableGutters className={classes.welcome}>
			<AlertModal open={openModal} setOpen={setOpenModal} message={flash?.message || "Default text"} severity={flash?.type} />
			<Box className="welcome" zIndex={2} position="relative">
				<Grid container>
					<Typography variant={isMobile ? "h2" : "h1"} component="h1" color="textSecondary">
						Welcome to
					</Typography>
				</Grid>
				<Grid container>
					<Typography variant={isMobile ? "h2" : "h1"} component="h2" color="textSecondary">
						ProjectKanri.
					</Typography>
				</Grid>
			</Box>
			<form onSubmit={handleSubmit} className="welcome-form">
				{continueSignUp ? (
					<Box width={isMobile ? "95%" : "75%"} boxShadow={4} className="signup-box">
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<TextField
									variant="filled"
									defaultValue={signUpDetails.email}
									required
									fullWidth
									color="primary"
									inputProps={{
										color: "textPrimary"
									}}
									aria-required
									onChange={handleChangeUserDetails}
									default={signUpDetails.email}
									label="Email"
									name="email"
									type="email"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									variant="filled"
									autoFocus
									required
									fullWidth
									color="primary"
									aria-required
									onChange={handleChangeUserDetails}
									label="Username"
									name="username"
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<TextField
									variant="filled"
									required
									fullWidth
									color="primary"
									aria-required
									onChange={handleChangeUserDetails}
									label="Password"
									name="password"
									type="password"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									variant="filled"
									required
									fullWidth
									color="primary"
									aria-required
									onChange={handleChangeUserDetails}
									label="Confirm password"
									name="password2"
									type="password"
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<TextField
									variant="filled"
									required
									fullWidth
									color="primary"
									aria-required
									onChange={handleChangeUserDetails}
									label="First Name"
									name="firstName"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									variant="filled"
									required
									fullWidth
									color="primary"
									aria-required
									onChange={handleChangeUserDetails}
									label="Last Name"
									name="lastName"
								/>
							</Grid>
						</Grid>
						{valid && (
							<Grid style={{ marginTop: "1rem" }} container justify="flex-end">
								<Button style={{ color: "white" }} onClick={() => setContinue(false)}>
									Cancel
								</Button>
								<Button color="primary" style={{ marginLeft: "1rem" }} type="submit" variant="contained" endIcon={<Send />}>
									Sign up!
								</Button>
							</Grid>
						)}
					</Box>
				) : (
					<React.Fragment>
						<Grid container>
							<TextField
								variant="filled"
								color="secondary"
								fullWidth
								onChange={handleChangeUserDetails}
								name="email"
								margin="normal"
								type="email"
								label="Enter your email address to get started."
							/>
						</Grid>
						<Grid container style={{ zIndex: 3 }}>
							<Button
								style={{ marginRight: "1rem" }}
								onClick={() => setContinue(true)}
								variant="contained"
								color="primary"
								endIcon={<ArrowForward />}
							>
								Continue sign up
							</Button>
							<ButtonLink
								style={{ marginTop: isMobile ? "0.5rem" : "initial", marginRight: "1rem" }}
								variant="contained"
								color="secondary"
								to="/login"
								type="button"
							>
								Login with exisiting account
							</ButtonLink>
							<Button
								style={{ marginTop: isMobile ? "0.5rem" : "initial", }}
								onClick={handleDemoLogin}
								variant="contained"
							>
								View demo
							</Button>
						</Grid>
					</React.Fragment>
				)}
			</form>
			<SakuraBranches zIndex={0} opacity="0.5" width={isMobile ? "15rem" : "25rem"} />
		</Container>
	);
};

export default Welcome;
