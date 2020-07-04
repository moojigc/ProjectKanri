import React, { useEffect } from "react";
import { useUserContext } from "../../utils/UserContext";
import userApi from "../../utils/userAPI";

const UserStatus = ({ children }) => {
	const [user, dispatchUser] = useUserContext();
	useEffect(() => {
		userApi({ action: "user-status" }).then((res) => dispatchUser({ user: res.user }));
	}, []);
	return <div>{children}</div>;
};

export default UserStatus;
