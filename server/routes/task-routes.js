const { User, Task, Project } = require("../models");
const { ObjectId } = require("mongoose").Types;
const { flash, serverError } = require("../config/utils");
/**
 * Handles tasks
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.get("/api/task/:id", async (req, res) => {
		// console.log("IN ROUTE: /api/task/:id" + req.params.id);
		try {
			let [project] = await Project.where("tasks", req.params.id)
				.select({ members: 1 })
				.where("tasks", req.params.id)
				.populate({ path: "members", select: { password: 0 } });
			let task = await Task.findById(req.params.id)
				.populate({ path: "creator", select: { password: 0 } })
				.populate({ path: "assignedUser", select: { password: 0 } })
				.populate({
					path: "comments",
					populate: { path: "creator", select: { password: 0 } }
				});

			res.json({ task: task, members: project.members }).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});

	router.put("/api/task/:id", async (req, res) => {
		console.log("IN PUT ROUTE: /api/task/" + req.params.id + " BODY: ", req.body);

		try {
			let dbTask = await Task.updateOne(
				{
					_id: req.params.id
				},
				{
					...req.body
				}
			);

			res.json(dbTask).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
};
