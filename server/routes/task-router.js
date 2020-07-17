const { User, Task, Project } = require("../models/");
const passport = require("../config/passport");
/**
 *
 * @param {string} message
 * @param {"error" | "success"} type
 */
const flash = (message, type) => {
	return {
		flash: {
			message: message,
			type: type
		}
	};
};
const serverError = (res) => res.status(500).json(flash("Internal server error.", "error")).end();

/**
 * Handles user login, status, registration, etc.
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.get("/api/task/:id", async (req, res) => {
		// console.log("IN ROUTE: /api/task/:id" + req.params.id);
		try {
			let [project] = await Project.where("tasks").in(req.params.id).select("members").populate("members");
			let task = await Task.findById(req.params.id).populate("creator").populate("assignedUser");

			res.json({ task: task, members: project.members }).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
};
