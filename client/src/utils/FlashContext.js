import React, { createContext } from "react";

/**
 * user data from the server
 */
const FlashContext = createContext({
	message: "",
	type: "error" || "success"
});
const { Provider } = FlashContext;

export { Provider, FlashContext };
