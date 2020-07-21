import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Wrapper, Title, ButtonLink } from "../../components/MiniComponents";
import { Typography as T, Button, Container, Grid, Divider } from "@material-ui/core";
import inviteAPI from "../../utils/inviteAPI";
import { Alert } from "@material-ui/lab";

const AcceptInvite = () => {
	const { token } = useParams();
	const history = useHistory();
	const [flash, setFlash] = useState({message: null, type: null})
	const handleAccept = async () => {
		let res = await inviteAPI.acceptInvite(token);
		setFlash(res.flash)
		setTimeout(() => {
			history.push(res.redirect);
		}, 1000)
	};

	return (
		<Container maxWidth="md">
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
