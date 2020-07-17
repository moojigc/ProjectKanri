const mongoose = require("mongoose");
const { Project } = require("../models");
const { db } = require("../models/Task");

/**
 * Handles user login, status, registration, etc.
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.get("/api/projects/:id", async (req, res) => {
		console.log(`IN ROUTE: /api/projects/:id ${req.params.id}`);
		try {
			let projects = await Project.findById(req.params.id)
				.populate("creator", { password: 0 })
				.populate("admins", { password: 0 })
				.populate("members", { password: 0 })
				.populate("tasks");

			return res.json(projects);
		} catch (error) {
			console.error(error);
			return res.status(400).json(error);
		}
	});

	router.get("/api/projects", async (req, res) => {
		console.log("IN ROUTE: /api/projects");
		try {
			let projects = await Project.find({})
				.populate("creator")
				.populate("admins")
				.populate("members")
				.sort({ _id: -1 });
			return res.json(projects);
		} catch (error) {
			console.error(error);
			return res.status(400).json(error);
		}
	});

	router.post("/api/projects", async ({ body }, res) => {
		console.log("IN ROUTE: post /api/projects", body);

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
			return res.status(400).json(error);
		}
	});
};
