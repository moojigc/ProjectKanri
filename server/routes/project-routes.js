const mongoose = require("mongoose");
const { Project } = require("../models");
const { db } = require("../models/Task");
const {flash, serverError, isAuth} = require("../config/utils")

/**
 * Handles project routes
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.get("/api/projects/:id", async (req, res) => {
		try {
			let projects = await Project.findById(req.params.id)
				.populate("creator", { password: 0 })
				.populate("admins", { password: 0 })
				.populate("members", { password: 0 })
				.populate("tasks");

			return res.json(projects);
		} catch (error) {
			console.error(error);
			serverError(res)
		}
	});

	router.get("/api/projects", async (req, res) => {
		try {
			let projects = await Project.find({
				$or: [{ admins: req.user._id }, { members: req.user._id }]
			})
				.populate("creator", { password: 0 })
				.populate("admins", { password: 0 })
				.populate("members", { password: 0 })
				.sort({ _id: -1 });
			return res.json(projects);
		} catch (error) {
			console.error(error);
			serverError(res)
		}
	});

	router.post("/api/projects", async ({ body }, res) => {
		let newUsers = [];
		newUsers.push(mongoose.Types.ObjectId(body.creator));

		try {
			let newProject = await Project.create({
				title: body.title,
				description: body.description,
				creator: mongoose.Types.ObjectId(body.creator),
				admins: newUsers,
				members: newUsers
			});

			return res.json(newProject);
		} catch (error) {
			console.error(error);
			serverError(res)
		}
	});
	router.put("/api/project/:id", isAuth, async ({body, params}, res) => {
		try {
			let update = await Project.findOneAndUpdate({
				_id: params.id
			}, {
				updatedAt: new Date(),
				description: body.description
			}, {
				new: true
			})
			res.json(update).end();
		} catch (error) {
			console.error(error)
			serverError(res)
		}
	})
};
