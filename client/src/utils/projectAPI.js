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
	},

	createProject: async (newProject) => {
		console.log("createProject - calling routes/project-routes");
		console.log("new project", newProject);

		let { data } = await axios({
			url: "/api/projects",
			method: "POST",
			data: newProject,
			withCredentials: true
		});

		return data;
	},

	updateDesc: async (desc, id) => {
		let { data } = await axios({
			url: "/api/project/" + id,
			data: {
				description: desc
			},
			method: "PUT",
			withCredentials: true
		});
		return data;
	}
};
