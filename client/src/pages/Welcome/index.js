import React, { useState, useContext, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { UserContext } from "../../utils/UserContext";
import { useHistory } from "react-router-dom";
import { makeStyles, Box, Typography, useMediaQuery, Paper } from "@material-ui/core";
import { ButtonLink, SakuraBranches } from "../../components/MiniComponents";
import { ArrowForward, Send } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	welcome: {
		background: "linear-gradient(159deg, rgba(255,222,222,1) 0%, rgba(97,108,153,1) 100%)",
		width: "100vw",
		height: "100vh",
		padding: "2rem"
	}
}));

const Welcome = () => {
	const [continueSignUp, setContinue] = useState(false);
	const [valid, setValid] = useState(false);
	const email = useRef(null);
	const isMobile = useMediaQuery("(max-width: 997px)");
	const [signUpDetails, setSignUpDetails] = useState({
		username: "",
		password: "",
		password2: "",
		firstName: "",
		lastName: "",
		email: ""
	});
	const handleChangeUserDetails = ({ target }) => {
		let { name, value } = target;
		setSignUpDetails({
			...signUpDetails,
			[name]: value
		});
		if (Object.values(signUpDetails).filter((s) => s !== "" || s === null).length === 0) {
			setValid(true);
		}
	};
	const { user, setUser } = useContext(UserContext);
	const classes = useStyles();
	const history = useHistory();
	const handleSubmit = (event) => {
		event.preventDefault();
		history.push("/signup");
		setUser({
			...user,
			email: email.current.value
		});
	};
	const Input = ({ defaultValue, name, label, type, margin }) => {
		return (
			<TextField
				defaultValue={defaultValue}
				color="secondary"
				fullWidth
				name={name}
				margin={margin}
				label={label}
				variant="filled"
				required
				aria-required
				type={type || "text"}
				onChange={handleChangeUserDetails}
			/>
		);
	};
	return (
		<Container maxWidth="xl" disableGutters className={classes.welcome}>
			<SakuraBranches zIndex={1} opacity="0.5" width={isMobile ? "15rem" : "25rem"} />
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
					<Box>
						<Grid container spacing={2}>
							<Grid item xs={12} lg={6}>
								<Input default={signUpDetails.email} label="Email" name="email" type="email" />
							</Grid>
							<Grid item xs={12} lg={6}>
								<Input label="Username" name="username" />
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12} lg={6}>
								<Input label="Password" name="password" type="password" />
							</Grid>
							<Grid item xs={12} lg={6}>
								<Input label="Confirm password" name="password2" type="password" />
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12} lg={6}>
								<Input label="First Name" name="firstName" />
							</Grid>
							<Grid item xs={12} lg={6}>
								<Input label="Last Name" name="lastName" />
							</Grid>
						</Grid>
						{valid && (
							<Button variant="contained" endIcon={<Send />}>
								Sign up
							</Button>
						)}
					</Box>
				) : (
					<React.Fragment>
						<Grid container>
							<Input margin="normal" type="email" label="Enter your email address to get started." />
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
								style={{ marginTop: isMobile ? "0.5rem" : "initial" }}
								variant="contained"
								color="secondary"
								to="/login"
								type="button"
							>
								Login with exisiting account
							</ButtonLink>
						</Grid>
					</React.Fragment>
				)}
			</form>
		</Container>
	);
};

export default Welcome;
