const { User } = require("../models/");
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
		}
		if (body.password === body.password2) {
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
				let fields = Object.keys(error.keyValue);
				let field = fields.length > 0 ? fields[0] : null;
				res.json({
					...flash(`User with that ${field} already exists!`, "error"),
					success: false,
					redirect: "/register"
				});
			}
		} else {
			res.json({ ...flash("Passwords must match!", "error"), redirect: "/register" });
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
				return res.json({
					...flash(err, "error"),
					user: {
						auth: false
					},
					redirect: "/login"
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
					...flash(`Welcome, ${req.body.username}!`, "success"),
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
};
