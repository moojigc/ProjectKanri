const { Project, User } = require("../models");
const { flash, serverError, isAuth } = require("../config/utils");
const nodemailer = require("../config/nodemailer");
const EMAIL_SECRET = process.env.EMAIL_SECRET || require("../config/secrets.json").EMAIL_SECRET;
const jwt = require("jsonwebtoken");
const { emailRegex } = require("../../shared");
const { ObjectId } = require("mongoose").Types;
const compareIds = (id1, id2) => ObjectId(id1).equals(ObjectId(id2));

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
			res.json(filteredUsers).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.get("/api/invite-member", isAuth, async ({ query, user }, res) => {
		try {
			if (user.username === "guest") return res.json(flash("Create a real account to invite users to your projects!", "success"))
			let member = await User.findOne({ _id: query.userId });
			let project = await Project.findOne({
				_id: query.projectId
			});
			if (project.members.includes(member._id)) return res.json(flash(`${member.username} is already part of this project.`, "error"));
			const token = jwt.sign(
				{
					admin: query.admin,
					projectId: project._id,
					userId: query.userId,
					projectTitle: project.title
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
	router.get("/api/invite-member/:token", async (req, res) => {
		try {
			let { projectTitle } = jwt.verify(req.params.token, EMAIL_SECRET);
			res.json({ projectTitle: projectTitle }).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/invite-member/:token", isAuth, async (req, res) => {
		try {
			let { admin, projectId, userId } = jwt.verify(req.params.token, EMAIL_SECRET);
			let adminBoolean = admin === "true";
			if (!compareIds(userId, req.user._id))
			return res.json(flash(`Sorry, ${req.user.username}, you are not the intended recipient of this invite.`, "error"));
			let { members } = await Project.findOne({ _id: projectId });
			if (members.filter((m) => compareIds(m, userId)).length > 0) return res.json(flash("You are already in this project.", "error"));
			if (adminBoolean) {
				let project = await Project.findOneAndUpdate(
					{ _id: projectId },
					{
						$push: {
							admins: userId,
							members: userId
						}
					},
					{ new: true }
				);
				res.json({
					...flash(`You have now been added to ${project.title} as an administrator.`, "success"),
					redirect: `/project/${project._id}`
				}).end();
			} else {
				let project = await Project.findOneAndUpdate(
					{ _id: projectId },
					{
						$push: {
							members: req.userId
						},
						updatedAt: new Date()
					},
					{ new: true }
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
	// router.get("/api/all-users", async (req, res) => {
	// 	if (process.env.NODE_ENV === "production") return;
	// 	let users = await User.find();
	// 	let projects = await Project.find().populate("tasks");
	// 	res.json({ users: users, projects: projects });
	// });
};
