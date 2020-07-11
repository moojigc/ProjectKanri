const { User, Project } = require("../models/");
const { ObjectId } = require("mongoose").Types;
const passport = require("../config/passport");
/**
 *
 * @param {string} message
 * @param {"error" | "success"} type
 */
const flash = (message, type) => {
	return {
		flash: {
			message: message,
			type: type
		}
	};
};

const guestUser = {
	_id: null,
	username: "Guest",
	auth: false
};

/**
 * Handles user login, status, registration, etc.
 * @param {import("express").Router} router
 */
module.exports = (router) => {
	router.post("/api/register", async ({ body }, res) => {
		const isInvalid =
			Object.values(body).filter((field) => field === null || field === "").length > 0;
		if (isInvalid) {
			res.json({
				...flash("Missing fields.", "error"),
				redirect: "/register"
			});
			return;
		} else if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(body.email)) {
			res.json({
				...flash("Not a valid email.", "error"),
				redirect: "/register"
			});
			return;
		} else if (body.password !== body.password2) {
			res.json({ ...flash("Passwords must match!", "error"), redirect: "/register" });
		} else {
			let user = new User({
				username: body.username,
				email: body.email,
				password: body.password
			});
			try {
				await user.encryptPass();
				await User.create(user.toObject());
				res.status(200).json({
					...flash(`Welcome, ${body.username}!`, "success"),
					redirect: "/login"
				});
			} catch (error) {
				let fields = error.keyValue ? Object.keys(error.keyValue) : null;
				let field = fields.length > 0 ? fields[0] : null;
				field
					? res.json({
							...flash(
								`${
									field.charAt(0).toUpperCase() + field.substring(1)
								} already taken.`,
								"error"
							),
							success: false,
							redirect: "/register"
					  })
					: serverError(res);
			}
		}
	});
	router.post("/api/login", (req, res, next) => {
		if (!req.body.usernameOrEmail || !req.body.password)
			return res.json({
				...flash("Missing fields.", "error"),
				user: guestUser
			});
		req.session.cookie.maxAge = req.body.rememberMe
			? 60000 * 60 * 24 * 7 * 26
			: 60000 * 60 * 24;
		passport.authenticate("local", function (err, user, info) {
			if (err) {
				console.log(err);
				return res.json({
					user: {
						auth: false
					},
					redirect: "/login",
					...flash(err.message, "error")
				});
			}
			if (!user) {
				return res.json({
					...flash("User not found.", "error"),
					user: guestUser,
					redirect: "/login"
				});
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}
				return res.json({
					user: {
						_id: user._id,
						username: user.username,
						auth: true
					},
					...flash(`Welcome, ${user.username}!`, "success"),
					redirect: "/"
				});
			});
		})(req, res, next);
	});
	router.get("/api/user-status", (req, res) => {
		switch (!!req.user) {
			case true:
				res.status(200).json({ user: req.user }).end();
				break;
			default:
			case false:
				res.json({
					user: guestUser
				}).end();
				break;
		}
	});
	router.get("/api/logout", (req, res) => {
		req.logout();
		res.json({
			user: guestUser,
			...flash("Logged out.", "success"),
			redirect: "/login"
		});
	});
	router.get("/api/myprofile", async (req, res) => {
		try {
			let adminProjects = await Project.where("admins")
				.in(ObjectId(req.user._id))
				.populate({
					path: "admins",
					select: { password: 0 },
					match: { _id: req.user._id }
				});
			let regularProjects = await Project.where("members")
				.in(ObjectId(req.user._id))
				.populate("members", { password: 0, email: 0 });
			res.json({ adminProjects, regularProjects }).end();
		} catch (error) {
			res.json(error).end();
		}
	});
};
