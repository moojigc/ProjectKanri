const { Project } = require("../models");

/**
 * Handles user login, status, registration, etc.
 * @param {import("express").Router} router
 */
module.exports = (router) => {
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
};
