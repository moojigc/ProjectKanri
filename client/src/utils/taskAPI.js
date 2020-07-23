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
	deleteTask: async (id) => {
		return await request({
			url: `/api/task/${id}`,
			method: "DELETE",
		})
	},
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
		console.log("CALLING routes/task-routes: " + JSON.stringify(id) + " AND ", task);

		return await request({
			url: `/api/task/${id}`,
			method: "PUT",
			data: task
		});
	},
	postComment: async (taskId, comment) => {
		return await request({
			url: `/api/task-comments?taskId=${taskId}`,
			method: "POST",
			data: {
				comment: comment
			}
		});
	},
	editComment: async (taskId, commentId, body) => {
		return await request({
			url: `/api/task-comment?commentId=${commentId}&taskId=${taskId}`,
			method: "PUT",
			data: {
				body: body
			}
		})
	},
	deleteComment: async (taskId, commentId) => {
		return await request({
			url:  `/api/task-comment?commentId=${commentId}&taskId=${taskId}`,
			method: "DELETE",
		})
	}
};
