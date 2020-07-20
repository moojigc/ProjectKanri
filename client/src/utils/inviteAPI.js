import axios from "axios";

/**
 *
 * @param {import('axios').AxiosRequestConfig} options
 */
const request = async (options, token) => {
	try {
		let { data } = await axios({
			url: options.url || `/api/invite-member/${token}`,
			...options,
			withCredentials: true
		});
		return data;
	} catch (error) {
		console.error(error);
		return { flash: { message: "Bad request.", type: "error" } };
	}
};

export default {
	/**
	 * Send an email invite to a user to join your project
	 * @param {string} id
	 * @param {boolean} admin
	 * @param {{ email?, username? }} body
	 */
	sendInvite: async (id, admin, body) => {
		return await request({
			data: body,
			method: "POST",
			url: `/api/invite-member?projectId=${id}&admin=${admin}`
		});
	},
	/**
	 * accept an invite using jwt
	 */
	acceptInvite: async (token) => {
		return await request(
			{
				method: "PUT"
			},
			token
		);
	}
};
