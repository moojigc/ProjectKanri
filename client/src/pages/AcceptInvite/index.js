import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Dashboard from "../Dashboard";
import ModalForm from "../../components/ModalForm";
import { Wrapper, Title } from "../../components/MiniComponents";
import { Typography as T, Button, Container, Grid } from "@material-ui/core";
import inviteAPI from "../../utils/inviteAPI";

const AcceptInvite = () => {
	const [open, setOpen] = useState(true);
	const { token } = useParams();
	const history = useHistory();
	const handleAccept = async () => {
		let res = await inviteAPI.acceptInvite(token);
		console.log(res);
		history.push(res.redirect);
	};

	return (
		<Container>
			<Wrapper>
				<Title>Accept Invite</Title>
				<Grid container>
					<T>Accept invite to new project?</T>
				</Grid>
				<Grid container>
					<Button>No</Button>
					<Button onClick={handleAccept} variant="contained">
						Yes
					</Button>
				</Grid>
			</Wrapper>
		</Container>
	);
};

export default AcceptInvite;
