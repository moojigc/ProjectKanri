const { Project, User } = require("../models");
const { flash, serverError, isAuth } = require("../config/utils");
const nodemailer = require("../config/nodemailer");
const EMAIL_SECRET = process.env.EMAIL_SECRET || require("../config/secrets.json").EMAIL_SECRET;
const jwt = require("jsonwebtoken");

/**
 *
 * @param {import('express').Router} router
 */
module.exports = (router) => {
	router.get("/api/search-members", isAuth, async (req, res) => {
		try {
			let users = await User.find().select({ firstName: 1, lastName: 1, email: 1, username: 1 });
			let filteredUsers = users
				.filter((u) => new RegExp(req.query.q, "i").test(u.username + u.email))
				.map(({ firstName, lastName, username, _id }) => {
					return {
						_id,
						firstName,
						lastName,
						username
					};
				});
			console.log(filteredUsers);
			res.json(filteredUsers).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.get("/api/invite-member", isAuth, async ({ query, user }, res) => {
		try {
			console.log(query);
			let member = await User.findOne({ _id: query.user });
			let project = await Project.findOne({
				_id: query.projectId
			});
			if (project.members.includes(member._id)) return res.json(flash(`${member.username} is already part of this project.`, "error"));
			const admin = new Boolean(query.admin);
			const token = jwt.sign(
				{
					admin: admin,
					projectId: project._id
				},
				EMAIL_SECRET,
				{
					expiresIn: "7d"
				}
			);
			nodemailer.sendInviteEmail({
				address: member.email,
				token: token,
				name: user.username
			});

			res.json(flash(`Invited ${member.firstName} ${member.lastName} to this project.`, "success"));
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/invite-member/:token", isAuth, async (req, res) => {
		if (!req.user) return res.status(401).json(flash("authentication error", "error"));
		try {
			let { admin, projectId } = jwt.verify(req.params.token, EMAIL_SECRET);
			if (admin) {
				let project = await Project.updateOne(
					{ _id: projectId },
					{
						$push: {
							admins: req.user_id,
							members: req.user._id
						},
						updatedAt: new Date()
					}
				);
				res.json({
					...flash(`You have now been added to ${project.title} as an administrator.`, "success"),
					redirect: `/project/${project._id}`
				}).end();
			} else {
				let project = await Project.updateOne(
					{ _id: projectId },
					{
						$push: {
							members: req.user._id
						},
						updatedAt: new Date()
					}
				);
				res.json({
					...flash(`You have now been added to ${project.title}.`, "success"),
					redirect: `/project/${project._id}`
				}).end();
			}
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	// for dev
	router.get("/api/all-users", async (req, res) => {
		if (process.env.NODE_ENV === "production") return;
		let users = await User.find();
		let projects = await Project.find().populate("tasks");
		res.json({ users: users, projects: projects });
	});
};
