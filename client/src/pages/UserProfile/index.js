import React, { useEffect, useState, useContext } from "react";
import Container from "@material-ui/core/Container";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import Axios from "axios";
import { UserContext } from "../../utils/UserContext";
import { TextField, Typography } from "@material-ui/core";
import moment from "moment";

const UserProfile = () => {
	const { user } = useContext(UserContext);
	const [userData, setUserData] = useState({
		_id: "",
		username: "",
		email: "",
		firstName: "",
		lastName: ""
	});
	useEffect(() => {
		Axios({ url: "/api/myprofile " }).then(({ data }) => {
			let [userDataFromServer] = data.adminProjects[0].admins.filter(
				(a) => a._id === user._id
			);
			setUserData(userDataFromServer);
			console.log(userDataFromServer);
		});
	}, []);
	return (
		<Container>
			<Wrapper>
				<Title>Hi, {userData.firstName + " " + userData.lastName}</Title>
				<Typography paragraph>Email: {userData.email}</Typography>
				<Typography paragraph>
					Account created: {moment(userData.createdAt).format("YYYY/MM/DD")}
				</Typography>
			</Wrapper>
		</Container>
	);
};

export default UserProfile;
