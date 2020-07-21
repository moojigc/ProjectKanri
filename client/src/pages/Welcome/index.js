import React, { useState, useContext, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { UserContext } from "../../utils/UserContext";
import { useHistory } from "react-router-dom";
import { makeStyles, Box, Typography, useMediaQuery, Paper } from "@material-ui/core";
import { ButtonLink, SakuraBranches } from "../../components/MiniComponents";
import { ArrowForward } from "@material-ui/icons";

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
	const email = useRef(null);
	const isMobile = useMediaQuery("(max-width: 997px)");
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
	return (
		<Container maxWidth="xl" disableGutters className={classes.welcome}>
			<SakuraBranches zIndex={1} opacity="0.5" width={isMobile? "15rem" : "25rem"} />
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
				<Grid container>
					<TextField
						inputRef={email}
						type="email"
						margin="normal"
						variant="filled"
						fullWidth
						color="secondary"
						label="Enter your email address to get started."
					/>
				</Grid>
				{continueSignUp ? (
					<Grid container>
						<TextField 
							required
							aria-required
							label="Username"
							name="username"
							fullWidth
						/>
					</Grid>
				) : (
					<Grid container style={{zIndex: 3}}>
						<Button style={{ marginRight: "1rem" }} onClick={() => setContinue(true)} variant="contained" color="primary" endIcon={<ArrowForward />}>
							Continue sign up
						</Button>
						<ButtonLink style={{ marginTop: isMobile ? "0.5rem" : "initial" }} variant="contained" color="secondary" to="/login" type="button">
							Login with exisiting account
						</ButtonLink>
					</Grid>
				)}
			</form>
		</Container>
	);
};

export default Welcome;
