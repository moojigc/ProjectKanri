const { User, Task, Project } = require("../models");
const { ObjectId } = require("mongoose").Types;
const { flash, serverError, isAuth } = require("../config/utils");
const compareIds = (id1, id2) => ObjectId(id1).equals(ObjectId(id2));

/**
 * Handles tasks
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.get("/api/task/:id", isAuth, async (req, res) => {
		try {
			let rawTask = await Task.findById(req.params.id)
				.populate({ path: "creator", select: { password: 0 } })
				.populate({ path: "assignedUser", select: { password: 0 } })
				.populate({
					path: "comments",
					options: {
						sort: { updatedAt: 'desc'}
					},
					populate: { path: "creator", select: { password: 0 } }
				})
				.populate({
					path: "project",
					populate: { path: "members", select: { password: 0 } }
				});
			let task = rawTask.toObject();
			task.comments = task.comments.map(c => {
				return {
					...c,
					editMode: false
				}
			})
			console.log(task.comments)
			res.json({ task: task, members: task.project.members }).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});

	router.put("/api/task/:id", isAuth, async (req, res) => {
		console.log("actually in this one")
		try {
			if (req.body.assignedUser === "NONE") {
				let dbTask = await Task.findOneAndUpdate(
					{
						_id: req.params.id
					},
					{
						...req.body,
						assignedUser: null,
						updatedAt: new Date()
					},
					{
						new: true
					}
				)
				res.json(dbTask.toObject()).end();
			} else {
				let dbTask = await Task.findOneAndUpdate(
					{
						_id: req.params.id
					},
					{
						...req.body,
						updatedAt: new Date()
					},
					{
						new: true
					}
				);
	
				res.json(dbTask.toObject()).end();
			}
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});

	router.post("/api/project/:id/task", isAuth, async (req, res) => {
		try {
			let dbTask = await Task.create({
				...req.body,
				project: req.params.id
			});
			let dbProject = await Project.updateOne(
				{
					_id: req.params.id
				},
				{
					updatedAt: new Date(),
					$push: {
						tasks: dbTask._id
					}
				}
			);

			res.json({ project: dbProject, task: dbTask }).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.delete("/api/task/:id", isAuth, async (req, res) => {
		let task = await Task.findOne({_id: req.params.id}).populate("project")
		if (compareIds(req.user._id, task.creator) || task.project.admins.includes(ObjectId(req.user._id))) {
			await task.deleteOne();
			res.json({
				success: true,
				...flash("Task deleted", "success")
			})
		} else res.json(flash("You cannot do that.", "error"))
	})
};
