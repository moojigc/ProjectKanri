import axios from "axios";

export default {
	getProject: async (id) => {
		console.log(`calling routes/project-routes`);
		let { data } = await axios({
			url: "/api/project/" + id,
			method: "GET",
			withCredentials: true
		});

		return data;
	}
};
