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
	},
	/**
	 * @param {"makeAdminNew" | "makeAdminExisiting" | "removeAdminRights" | "removeMember"} action
	 */
	membersDispatch: async (action, pId, userId) => {
		let { data } = await axios({
			url: `/api/project/${pId}/members?userId=${userId}&action=${action}`,
			method: "PUT",
			withCredentials: true
		})
		return data;
	},
	delete: async (id) => {
		let { data } = await axios({
			url: `/api/project/${id}`,
			method: "DELETE",
			withCredentials: true
		})
		return data;
	}
};
