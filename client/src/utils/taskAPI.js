import axios from "axios";

export default {
	getTask: async (id) => {
		try {
			let { data } = await axios({
				url: `/api/task/${id}`,
				method: "GET",
				withCredentials: true
			});
			return data;
		} catch (error) {
			console.error(error);
			return { flash: { message: "Bad request.", type: "error" } };
		}
	},

	updateTask: async (id, task) => {
		console.log("CALLING routes/task-routes: " + id + " AND ", task);

		try {
			let { data } = await axios({
				url: `/api/task/${id}`,
				method: "PUT",
				data: task,
				withCredentials: true
			});

			return data;
		} catch (error) {
			return { flash: { message: "Bad request.", type: "error" } };
		}
	}
};
