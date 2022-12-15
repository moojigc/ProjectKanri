import Axios from "axios";

const axios = Axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL,
	withCredentials: true
});

export default axios;
