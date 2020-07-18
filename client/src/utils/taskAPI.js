import axios from "axios";

/**
 * @param {import('axios').AxiosRequestConfig} options
 */
const request = async (options) => {
	try {
		let { data } = await axios({
			...options,
			withCredentials: true
		});
		return data;
	} catch (error) {
		console.dir(error);
		return { flash: { message: "Bad request.", type: "error" } };
	}
};

export default {
	getTask: async (id) => {
		return await request({
			url: `/api/task/${id}`,
			method: "GET"
		});
	},
	createTask: async (projectId, task) => {
		return await request({
			url: `/api/project/${projectId}/task`,
			method: "POST",
			data: task
		});
	},

	updateTask: async (id, task) => {
		console.log("CALLING routes/task-routes: " + id + " AND ", task);

		return await request({
			url: `/api/task/${id}`,
			method: "PUT",
			data: task
		});
	},
	postComment: async (taskId, comment) => {
		return await request({
			url: `/api/task/${taskId}/comments`,
			method: "POST",
			data: {
				comment: comment
			}
		});
	}
};
