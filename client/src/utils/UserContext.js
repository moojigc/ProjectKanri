import { createContext } from "react";

/**
 * user data from the server
 */
const UserContext = createContext({
	_id: "",
	email: "",
	username: "",
	auth: false
});
const { Provider } = UserContext;

export { Provider, UserContext };
