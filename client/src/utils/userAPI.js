import Axios from "axios";

/**
 * send login request to server
 * @param {Object} data
 * @param {string} [data.username]
 * @param {string} [data.email]
 * @param {string} data.password
 */
export const login = async ({ username, email, password }) => {
	let { data } = await Axios({
		url: "/api/login",
		data: { username, email, password },
		method: "POST",
		withCredentials: true
	});
	return data;
};

/**
 * send register request to server
 * @param {Object} data
 * @param {string} data.username
 * @param {string} data.email
 * @param {string} data.password
 */
export const register = async ({ username, email, password, password2 }) => {
	let { data } = await Axios({
		url: "/api/register",
		method: "POST",
		data: {
			username,
			email,
			password,
			password2
		},
		withCredentials: true
	});
	return data;
};

/**
 * Sends Logout API request to server
 */
export const logout = async () => {
	let { data } = await Axios({
		url: "/api/logout",
		method: "GET",
		withCredentials: true
	});
	return data;
};

/**
 * Check whether or not user is logged in
 */
export const getUserStatus = async () => {
	let { data } = await Axios({
		url: "/api/user-status",
		method: "GET",
		withCredentials: true
	});
	return data;
};
