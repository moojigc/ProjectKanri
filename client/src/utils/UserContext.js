import React, { createContext, useReducer, useContext } from "react";
import { Types } from "mongoose";

/**
 * user data from the server
 */
const UserContext = createContext({
	_id: Types.ObjectId(),
	username: "",
	auth: false
});
const { Provider } = UserContext;

/**
 * Get and set user state
 * @param {{ _id: any, username: string, auth: boolean }} userState
 * @param {{ user: {_id, password, password2?, email, username, auth: boolean} }} action
 */
const reducer = (userState, action) => {
	// I was gonna include all the user actions in this reducer, but the reducer doesn't play nice with Promises,
	// so you must include the dispatch function inside a separate callback/async function
	return action.user;
};

const UserProvider = ({ value = {}, ...props }) => {
	const [user, dispatch] = useReducer(reducer, {});

	return <Provider value={[user, dispatch]} {...props} />;
};

const useUserContext = () => {
	return useContext(UserContext);
};

export { UserProvider, useUserContext };
