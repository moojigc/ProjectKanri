import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Wrapper, Title, ButtonLink } from "../../components/MiniComponents";
import { Typography as T, Button, Container, Grid, Divider, useMediaQuery, TextField, FormControlLabel, Switch } from "@material-ui/core";
import inviteAPI from "../../utils/inviteAPI";
import { Alert } from "@material-ui/lab";
import ModalForm from "../../components/ModalForm";
import { emailRegex } from "../../utils/shared";
import userAPI from "../../utils/userAPI";

const AcceptInvite = ({ user, setUser }) => {
	const { token } = useParams();
	const history = useHistory();
	const [open, setOpen] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [flash, setFlash] = useState({ message: null, type: null });
	const handleAccept = async () => {
		switch (user.auth) {
			case true:
				{
					let res = await inviteAPI.acceptInvite(token);
					setFlash(res.flash);
					setTimeout(() => {
						history.push(res.redirect);
					}, 1000);
				}
				break;
			default:
			case false:
				setFlash({ message: "Must login to accept invite.", type: "error" });
				setOpen(true);
				break;
		}
	};
	const [login, setLogin] = useState({ usernameOrEmail: null, password: null, rememberMe: false });
	const handleLoginDetails = ({ target }) => {
		const { name, value, checked } = target
		setLogin({
			...login,
			[target.name]: name === "rememberMe" ? checked : value
		});
		console.log(login)
	};
	const handleLogin = async (event) => {
		event.preventDefault();
		let res = await userAPI.login(login);
		setUser(res.user);
		setFlash(res.flash);
		setOpen(false);
	};

	const isMobile = useMediaQuery("(max-width: 960px)");
	return (
		<Container maxWidth="md">
			<ModalForm
				onFormSubmit={handleLogin}
				open={open}
				setOpen={setOpen}
				flash={flash}
				information="You must login to accept an invite."
				BoxStyle={{ width: isMobile ? "95vw" : "600px" }}
				TextFields={[
					<TextField fullWidth label="Username or email" name="usernameOrEmail" onChange={handleLoginDetails} />,
					<TextField fullWidth type="password" label="Password" name="password" onChange={handleLoginDetails} />,
					<Grid container justify="center">
						<FormControlLabel
							name="rememberMe"
							label="Remember me?"
							control={<Switch aria-label="remember me" name="rememberMe" onChange={handleLoginDetails} checked={login.rememberMe} />}
						/>
					</Grid>
				]}
			/>
			<Wrapper>
				<Title>Accept Invite</Title>
				<Grid container justify="center">
					<T>Confirm you want to join new project?</T>
				</Grid>
				<Divider style={{ margin: "0.75rem 0" }} />
				<Grid container justify="center">
					<ButtonLink to="/">Ignore</ButtonLink>
					<Button onClick={handleAccept} variant="contained">
						Confirm
					</Button>
				</Grid>
			</Wrapper>
			{flash.message && <Alert severity={flash.type}>{flash.message}</Alert>}
		</Container>
	);
};

export default AcceptInvite;
