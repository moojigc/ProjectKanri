const { User, Project } = require("../models/"),
	{ ObjectId } = require("mongoose").Types,
	passport = require("../config/passport"),
	jwt = require("jsonwebtoken"),
	{ sendResetEmail } = require("../config/nodemailer"),
	EMAIL_SECRET = process.env.EMAIL_SECRET || require("../config/secrets.json").EMAIL_SECRET,
	crypt = require("../config/crypt"),
	{ emailRegex } = require("../../shared");
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
const serverError = (res) => res.status(500).json(flash("Internal server error.", "error")).end();

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
		} else if (emailRegex.test(body.email)) {
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
			let user = await User.findOne({ _id: req.user._id }).select({ password: 0 });
			let projects = await Project.find({
				$or: [{ admins: req.user._id }, { members: req.user._id }]
			});
			res.json({ projects, user }).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.post("/api/reset-pass", async (req, res) => {
		console.log(req.body);
		try {
			const user = await User.findOne({ email: req.body.email }).select("_id, email");
			console.log(user);
			if (!user)
				return res.json(flash("Account with that email address not found.", "error"));
			const token = jwt.sign(
				{
					user: user._id
				},
				EMAIL_SECRET,
				{
					expiresIn: "1d"
				}
			);
			sendResetEmail({ address: user.email, token: token });
			res.json(
				flash(
					`Please check ${user.email} for instructions on resetting your password.`,
					"success"
				)
			).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/reset-pass/:token", async (req, res) => {
		try {
			if (req.body.password !== req.body.password2)
				return res.json(flash("Passwords must match!", "error")).end();
			const { user } = jwt.verify(req.params.token, EMAIL_SECRET);
			const hashedPass = await crypt(req.body.password);
			let update = await User.updateOne({ _id: user }, { password: hashedPass });
			if (update.nModified === 1)
				res.json(flash("Password successfully updated.", "success"));
			else throw new Error("Could not update password");
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/update-pass", async (req, res) => {
		if (!req.user) {
			res.json(flash("Not logged in!", "error"));
			return;
		} else if (req.body.password !== req.body.password2) {
			res.json(flash("Passwords must match.", "error")).end();
			return;
		}
		try {
			let { password } = await User.findOne({ _id: req.user._id }).select({ password: 1 });
			console.log(password, req.body.currentPassword);
			let match = await crypt(req.body.currentPassword, password);
			if (match) {
				await User.updateOne(
					{ _id: req.user._id },
					{ password: await crypt(req.body.password) }
				);
				res.json(flash("Successfully updated password!", "success")).end();
			} else res.json(flash("Sorry, incorrect password.", "error")).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
};
