const { ObjectId } = require("mongoose").Types;
const { Project } = require("../models");
const { flash, serverError, isAuth } = require("../config/utils");
const compareIds = (id1, id2) => ObjectId(id1).equals(ObjectId(id2));

/**
 * Handles project routes
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.get("/api/projects/:id", async (req, res) => {
		try {
			let project = await Project.findById(req.params.id)
				.populate({ path: "tasks", populate: { path: "assignedUser", select: { password: 0 } } })
				.populate("members", { password: 0 });
			let userIsAdmin = project.admins.filter((a) => ObjectId(a).equals(req.user._id)).length > 0;
			let projectObj = project.toObject();
			projectObj.admins = project.members.filter((m) => project.admins.includes(ObjectId(m._id)));
			projectObj.members = projectObj.members.map((m) => {
				return {
					...m,
					isAdmin: project.admins.includes(ObjectId(m._id))
				};
			});
			console.log(projectObj, `User is admin: ${userIsAdmin}`);
			res.json({
				...projectObj,
				userIsAdmin: userIsAdmin
			});
		} catch (error) {
			console.error(error);
			serverError(res);
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
			res.json(projects);
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});

	router.post("/api/projects", async ({ body }, res) => {
		let newUsers = [];
		newUsers.push(ObjectId(body.creator));

		try {
			let newProject = await Project.create({
				title: body.title,
				description: body.description,
				creator: ObjectId(body.creator),
				admins: newUsers,
				members: newUsers
			});

			res.json(newProject);
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/project/:id", isAuth, async ({ body, params }, res) => {
		try {
			let update = await Project.findOneAndUpdate(
				{
					_id: params.id
				},
				{
					updatedAt: new Date(),
					description: body.description
				},
				{
					new: true
				}
			);
			res.json(update).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/project/:id/members", isAuth, async (req, res) => {
		try {
			let project = await Project.findOne({ _id: req.params.id });
			if (project.admins.includes(ObjectId(req.user._id))) {
				switch (req.query.action) {
					case "makeAdminNew":
						{
							let project = await Project.findOneAndUpdate(
								{ _id: req.params.id },
								{
									$push: {
										admins: req.query.userId,
										members: req.query.userId
									}
								},
								{
									new: true
								}
							);
							res.json(project).end();
						}
						break;
					case "makeAdminExisiting":
						{
							let project = await Project.findOneAndUpdate(
								{ _id: req.params.id },
								{
									$push: {
										admins: req.query.userId
									}
								},
								{
									new: true
								}
							);
							res.json(project).end();
						}
						break;
					case "removeAdminRights":
						{
							if (!ObjectId(req.user._id).equals(project.creator)) return res.json(flash("Can't do that.", "error"));
							let update = await Project.findOneAndUpdate(
								{ _id: req.params.id },
								{
									$pull: {
										admins: req.query.userId
									}
								},
								{
									new: true
								}
							);
							res.json(update).end();
						}
						break;
					case "removeMember": {
						if (!ObjectId(req.user._id).equals(project.creator)) return res.json(flash("Can't do that.", "error"));
						let update = await Project.findOneAndUpdate(
							{ _id: req.params.id },
							{
								$pull: {
									admins: req.query.userId,
									member: req.query.userId
								}
							},
							{
								new: true
							}
						);
						res.json(update).end();
					}
				}
			} else return res.json(flash("auth error", "error"));
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.delete("/api/project/:id", isAuth, async (req, res) => {
		let project = await Project.findOne({ _id: req.params.id });
		if (!compareIds(req.user._id, project.creator)) return res.json(flash("Must be the creator to delete a project.", "error"));
		await Project.deleteOne({ _id: req.params.id });
		res.json({ success: true, ...flash(`${project.title} deleted successfully.`, "success") });
	});
};
