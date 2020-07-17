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
      return {flash: { message: "Bad request.", type: "error" } };
    }
  },
};
