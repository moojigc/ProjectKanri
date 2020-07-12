import axios from "axios";

export default {
	getProject: async (id) => {
		console.log(`calling routes/project-routes`);
		let { data } = await axios({
			url: "/api/projects/" + id,
			method: "GET",
			withCredentials: true
		});

		return data;
	},

	getAllProjects: async () => {
		console.log(`calling routes/project-routes`);
		let { data } = await axios({
			url: "/api/projects",
			method: "GET",
			withCredentials: true
		});

		return data;
	}
};
