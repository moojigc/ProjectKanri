const { Task, TaskComment } = require("../models");
const { flash, serverError } = require("../config/utils");

/**
 *
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.post("/api/task/:taskId/comments", async (req, res) => {
		if (!req.user) return res.json(flash("authorization error", "error"));
		console.log(req.body, req.user);
		try {
			let comment = await TaskComment.create({
				...req.body.comment,
				creator: req.user._id
			});
			await Task.updateOne(
				{ _id: req.params.taskId },
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
};
