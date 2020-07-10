import React, { useEffect, useState, useContext } from "react";

import Container from "@material-ui/core/Container";

import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";

const UserProfile = () => {
	const [userData, setUserData] = useState({
		_id: "",
		username: "",
		email: "",
		firstName: "",
		lastName: ""
	});
	return (
		<Container>
			<Wrapper>
				<Title>{userData.firstName + " " + userData.lastName}</Title>
			</Wrapper>
		</Container>
	);
};

export default UserProfile;
