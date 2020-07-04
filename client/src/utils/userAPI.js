import Axios from "axios";

/**
 *
 * @param {Object} d
 * @param {"login" | "register" | "logout" | "user-status"} d.action
 * @param {{username, email, password, password2?}} [d.userDetails]
 * @param {string} [d.username]
 * @param {string} [d.email]
 * @param {string} [d.password]
 * @param {string} [d.password2]
 */
const userRequest = async ({ action, userDetails, username, email, password, password2 }) => {
	let { data } = await Axios({
		url: `/api/${action}`,
		method: action === "logout" || action === "user-status" ? "GET" : "POST",
		data: userDetails || {
			username,
			email,
			password,
			password2
		},
		withCredentials: true
	});
	return data;
};

export default userRequest;
