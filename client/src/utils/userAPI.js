import Axios from "axios";

/**
 * Server request handler
 * @param {"login" | "register" | "logout" | "user-status"} action
 * @param {"GET" | "POST"} [method]
 * @param {Object} [details]
 * @param {string} [details.username]
 * @param {string} [details.email]
 * @param {string} [details.password]
 * @param {string} [details.password2]
 */
const request = async (action, details, method) => {
	let { data } = await Axios({
		url: `/api/${action}`,
		method: method || "GET",
		data: details,
		withCredentials: true
	});
	return data;
};

/**
 * Interact with the server-side user APIs
 */
const userRequest = {
	/**
	 * Async login request
	 * @param {Object} data
	 * @param {string} data.usernameOrEmail
	 * @param {string} data.password
	 * @param {boolean} data.rememberMe
	 */
	login: async (data) => {
		return await request("login", data);
	},
	/**
	 * Async create new user request
	 * @param {Object} data
	 * @param {string} data.username
	 * @param {string} data.email
	 * @param {string} data.password
	 * @param {string} data.password2
	 */
	register: async (data) => {
		return await request("register", data, "POST");
	},
	logout: async () => {
		return await request("logout");
	},
	checkStatus: async () => {
		return await request("user-status");
	}
};

export default userRequest;
