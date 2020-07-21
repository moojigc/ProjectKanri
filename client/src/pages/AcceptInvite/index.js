import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Wrapper, Title, ButtonLink } from "../../components/MiniComponents";
import { Typography as T, Button, Container, Grid, Divider } from "@material-ui/core";
import inviteAPI from "../../utils/inviteAPI";

const AcceptInvite = () => {
	const [open, setOpen] = useState(true);
	const { token } = useParams();
	const history = useHistory();
	const handleAccept = async () => {
		let res = await inviteAPI.acceptInvite(token);
		history.push(res.redirect);
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
		</Container>
	);
};

export default AcceptInvite;
