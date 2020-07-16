const { User, Task } = require("../models/");
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
			let task = await Task.findById(req.params.id);
			res.json(task).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
};
