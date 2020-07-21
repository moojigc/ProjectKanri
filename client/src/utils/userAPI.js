import Axios from "axios";

/**
 * Server request handler
 * @param {"login" | "register" | "logout" | "user-status" | "reset-pass" | "update-pass" | "verify"} action
 * @param {"GET" | "POST" | "PUT"} [method]
 * @param {Object} [details]
 * @param {string} [details.username]
 * @param {string} [details.email]
 * @param {string} [details.password]
 * @param {string} [details.password2]
 * @param {string} [params]
 */
const request = async (action, details, method, params) => {
	try {
		let { data } = await Axios({
			url: `/api/${action}/${params || ""}`,
			method: method || "GET",
			data: details,
			withCredentials: true
		});
		return data;
	} catch (error) {
		console.error(error);
		return { user: { auth: false }, flash: { message: "Bad request.", type: "error" } };
	}
};

/**
 * Interact with the server-side user APIs
 */
const userAPI = {
	/**
	 * Async login request
	 * @param {Object} data
	 * @param {string} data.usernameOrEmail
	 * @param {string} data.password
	 * @param {boolean} data.rememberMe
	 */
	login: async (data) => {
		return await request("login", data, "POST");
	},
	/**
	 * Async create new user request
	 * @param {Object} data
	 * @param {string} data.username
	 * @param {string} data.email
	 * @param {string} data.password
	 * @param {string} data.password2
	 * @param {string} data.firstName
	 * @param {string} data.lastName
	 */
	register: async (data) => {
		return await request("register", data, "POST");
	},
	logout: async () => {
		return await request("logout");
	},
	checkStatus: async () => {
		return await request("user-status");
	},
	/**
	 * Sends reset pass email
	 * @param {string} email
	 */
	sendResetEmail: async (email) => {
		return await request("reset-pass", { email: email }, "POST");
	},
	/**
	 * Updates password with JWT token
	 * @param {string} newPassword
	 * @param {string} confirm - should match newPassword
	 * @param {string} token
	 */
	updatePassword: async (newPassword, confirm, token) => {
		return await request(
			"reset-pass",
			{ password: newPassword, password2: confirm },
			"PUT",
			token
		);
	},
	updatePasswordWithCurrent: async (current, newPassword, confirmNewPassword) => {
		return await request(
			"update-pass",
			{ currentPassword: current, password: newPassword, password2: confirmNewPassword },
			"PUT"
		);
	},
	verifyUser: async (token) => {
		return await request("verify", null, "PUT", token);
	}
};

export default userAPI;
