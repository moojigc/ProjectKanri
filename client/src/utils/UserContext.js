import React, { createContext } from "react";

/**
 * user data from the server
 */
const UserContext = createContext({
	_id: "",
	username: "",
	auth: false
});
const { Provider } = UserContext;

export { Provider, UserContext };
