import React, { useEffect, useState, useContext, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { UserContext } from "../../utils/UserContext";
import { FlashContext } from "../../utils/FlashContext";
import { useHistory } from "react-router-dom";
import { makeStyles, Box, Typography, useMediaQuery } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import { ArrowForward } from "@material-ui/icons";
import Register from "../Register";

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
			<Box>
				<Grid container spacing={4}>
					<Grid item container xs={12}>
						<Grid item xs={12}>
							<Typography
								variant={isMobile ? "h2" : "h1"}
								component="h1"
								color="textSecondary">
								Welcome
							</Typography>
							<Typography
								variant={isMobile ? "h2" : "h1"}
								component="h1"
								color="textSecondary">
								to ProjectKanri.
							</Typography>
						</Grid>
					</Grid>
					<Grid item container xs={12}>
						<Grid item lg={4} xs={12}>
							<form onSubmit={handleSubmit}>
								<TextField
									inputRef={email}
									type="email"
									margin="normal"
									variant="filled"
									fullWidth
									color="secondary"
									label="Enter your email address to get started"
								/>
								<Button
									style={{ marginRight: "1rem" }}
									type="submit"
									variant="contained"
									color="primary"
									endIcon={<ArrowForward />}>
									<Typography color="textPrimary">Continue Sign Up</Typography>
								</Button>
								<ButtonLink
									to="/login"
									type="button"
									variant="contained"
									color="secondary">
									Login
								</ButtonLink>
							</form>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};

export default Welcome;
