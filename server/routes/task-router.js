const { User, Task } = require("../models/");
const passport = require("../config/passport");

/**
 * Handles user login, status, registration, etc.
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.get("/api/task/:id", async (req, res) => {
		console.log("IN ROUTE: /api/task/:id" + req.params.id);
		try {
			let fakeTask = {
				_id: "al2r3vq32",
				title: "Test Task",
				description: "hello world",
				assignedTo: "Moojig"
			};
			let task = await Task.findById(req.params.id);
			res.json(task).end();
		} catch (error) {
			console.error(error);
			res.json("error").end();
		}
	});
};
