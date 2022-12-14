const { User, Project } = require("../models/"),
	{ ObjectId } = require("mongoose").Types,
	passport = require("../config/passport"),
	jwt = require("jsonwebtoken"),
	{ sendResetEmail, sendVerifyEmail } = require("../config/nodemailer"),
	EMAIL_SECRET = process.env.EMAIL_SECRET || require("../config/secrets.json").EMAIL_SECRET,
	crypt = require("../config/crypt"),
	{ emailRegex } = require("../../shared"),
	{ flash, serverError, isAuth } = require("../config/utils");
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
		console.log(body);
		const isInvalid = Object.values(body).filter((field) => field === null || field === "").length > 0;
		if (isInvalid) {
			res.json({
				...flash("All fields are required.", "error"),
				redirect: "/register"
			});
			return;
		} else if (!emailRegex.test(body.email)) {
			res.json({
				...flash("Not a valid email.", "error"),
				redirect: "/register"
			});
			return;
		} else if (body.password !== body.password2) {
			res.json({ ...flash("Passwords must match!", "error"), redirect: "/register" });
		} else {
			let user = new User({
				firstName: body.firstName,
				lastName: body.lastName,
				username: body.username,
				email: body.email,
				password: body.password
			});
			try {
				await user.encryptPass();
				console.log(user);
				let newUser = await User.create(user.toObject());
				res.status(200).json({
					...flash(
						`Welcome, ${body.username}! You will shortly receive an email with a link to verify your account. You cannot login until you are verified.`,
						"success"
					),
					redirect: "/login"
				});
				let token = jwt.sign(
					{
						_id: newUser._id,
						username: newUser.username
					},
					EMAIL_SECRET,
					{ expiresIn: "1d" }
				);
				sendVerifyEmail({ address: newUser.email, token: token });
			} catch (error) {
				console.log(error);
				let fields = error.keyValue ? Object.keys(error.keyValue) : null;
				let field = fields.length > 0 ? fields[0] : null;
				field
					? res.json({
							...flash(`${field.charAt(0).toUpperCase() + field.substring(1)} already taken.`, "error"),
							success: false,
							redirect: "/register"
					  })
					: serverError(res);
			}
		}
	});
	router.post("/api/login", (req, res, next) => {
		if (req.user) req.logout();
		if (!req.body.usernameOrEmail || !req.body.password)
			return res.json({
				...flash("Missing fields.", "error"),
				user: guestUser
			});
		req.session.cookie.maxAge = req.body.rememberMe ? 60000 * 60 * 24 * 7 * 26 : 60000 * 60 * 24;
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
			} else if (!user.verified) {
				return res
					.json({
						...flash(
							"Please verify your email address. If you did not receive an email from us, please check your spam folder or click the RESEND VERIFICATION button below.",
							"error"
						),
						notVerified: true,
						user: guestUser
					})
					.end();
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}
				return res.json({
					user: {
						_id: user._id,
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
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
				User.findOne({ _id: req.user._id }, (_err, user) => {
					if (_err || !user) {
						console.error(_err);
						res.json({
							user: guestUser
						});
					} else {
						res.status(200)
							.json({
								user: {
									_id: user._id,
									username: user.username,
									firstName: user.firstName,
									lastName: user.lastName,
									email: user.email,
									auth: true
								}
							})
							.end();
					}
				});
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
			if (!user) return res.json(flash("Account with that email address not found.", "error"));
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
			res.json(flash(`Please check ${user.email} for instructions on resetting your password.`, "success")).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/reset-pass/:token", async (req, res) => {
		try {
			if (req.body.password !== req.body.password2) return res.json(flash("Passwords must match!", "error")).end();
			const { user } = jwt.verify(req.params.token, EMAIL_SECRET);
			const hashedPass = await crypt(req.body.password);
			let update = await User.updateOne({ _id: user }, { password: hashedPass });
			if (update.nModified === 1) res.json(flash("Password successfully updated.", "success"));
			else throw new Error("Could not update password");
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/update-pass", isAuth, async (req, res) => {
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
				await User.updateOne({ _id: req.user._id }, { password: await crypt(req.body.password) });
				res.json(flash("Successfully updated password!", "success")).end();
			} else res.json(flash("Sorry, incorrect password.", "error")).end();
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
	router.put("/api/verify/:token", async (req, res, next) => {
		jwt.verify(req.params.token, EMAIL_SECRET, {}, async (err, object) => {
			if (err) {
				res.json({ expiredToken: true, ...flash(`Token has expired. If you need to reset your token, please login below.`, "error") });
			} else {
				try {
					let user = await User.findOneAndUpdate(
						{
							_id: object._id
						},
						{ verified: true, updatedAt: new Date() },
						{ new: true }
					);
					req.logIn(user, (err) => {
						if (err) return next(err);
						res.json({
							...flash(
								`Thank you for verifying your email, ${object.username}. You will shortly be redirected to your new dashboard.`,
								"success"
							),
							user: {
								_id: user._id,
								username: user.username,
								firstName: user.firstName,
								lastName: user.lastName,
								email: user.email,
								auth: true
							}
						}).end();
					});
				} catch (error) {
					console.error(error);
					serverError(res);
				}
			}
		});
	});
	router.get("/api/resend-verification/:usernameOrEmail", async (req, res) => {
		try {
			if (!req.params.usernameOrEmail) return res.json(flash("No username or email address entered.", "error"));
			let user = await User.findOne({
				[emailRegex.test(req.params.usernameOrEmail) ? "email" : "username"]: req.params.usernameOrEmail
			});
			if (!user) return res.json(flash("User not found.", "error"));
			let token = jwt.sign({ _id: user._id, username: user.username }, EMAIL_SECRET, {
				expiresIn: "1d"
			});
			await sendVerifyEmail({ address: user.email, token: token });
			res.json(flash("Please check your email for the verification. It may take a few minutes for you to receive it.", "success"));
		} catch (error) {
			console.error(error);
			serverError(res);
		}
	});
};
