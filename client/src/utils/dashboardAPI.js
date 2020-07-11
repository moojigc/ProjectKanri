import axios from "axios";

export default {
	getProjects: async () => {
		console.log(`calling routes/dashboard-routes`);
		let { data } = await axios({
			url: "/api/projects",
			method: "GET",
			withCredentials: true
		});

		return data;
	}
};
