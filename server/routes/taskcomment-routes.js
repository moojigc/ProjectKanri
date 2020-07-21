const { Task, TaskComment, Project } = require("../models");
const { flash, serverError, isAuth } = require("../config/utils");
const {ObjectId} = require("mongoose").Types
/**
 *
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.post("/api/task/comments", isAuth, async (req, res) => {
		if (!req.user) return res.json(flash("authorization error", "error"));
		console.log(req.body, req.user);
		try {
			let comment = await TaskComment.create({
				...req.body.comment,
				creator: req.user._id
			});
			await Task.updateOne(
				{ _id: req.query.taskId },
				{
					updatedAt: new Date(),
					$push: {
						comments: comment._id
					}
				}
			);
			res.json({ comment, ...flash("Saved comment.", "success") }).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/task/comment", isAuth, async (req, res) => {
		try {
			let comment = await TaskComment.findOne({ _id: req.query.commentId });
			if (!comment.creator !== req.user._id) return res.json(flash("authentication error", "error"))
			let update = await TaskComment.findByIdAndUpdate({_id: req.query.commentId }, {
				body: req.body.body,
				updatedAt: new Date()
			}, { new: true });
			res.json(update).end();
		} catch (error) {
			console.error(error)
			serverError(res)
		}
	})
	router.delete("/api/task/comment", isAuth, async (req, res) => {
		try {
			console.log(req.query) 
			let task = await Task.findOne({ _id: req.query.taskId }).populate("project");
			let comment = await TaskComment.findOne({ _id: req.query.commentId })
			console.log(req.user._id, comment.creator)
			console.log(ObjectId(comment.creator).equals(req.user._id))
			// Check if user is project admin or owner of said comment
			if (task.project.admins.includes(req.user._id) || ObjectId(comment.creator).equals(req.user._id)) {
				await TaskComment.deleteOne({ _id: req.query.commentId })
				res.json(flash("Deleted comment.", "success"));
			} else {
				res.json(flash("authorization error", "error"))
			}
		} catch (error) {
			console.error(error)
			serverError(res)
		}
	})
};
