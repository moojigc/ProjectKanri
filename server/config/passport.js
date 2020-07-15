const passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	{ User } = require("../models"),
	bcrypt = require("bcryptjs"),
	{ emailRegex } = require("../../shared");

// Tell passportJS to use a local strategy (as opposed to 3rd party, like Google auth or something)
passport.use(
	new LocalStrategy(
		{ usernameField: "usernameOrEmail" },
		async (usernameOrEmail, password, next) => {
			// Check if user typed in their email or username
			let searchParams = emailRegex.test(usernameOrEmail)
				? { email: usernameOrEmail }
				: { username: usernameOrEmail };
			// Check if user exists in database, will be null if none, that user or null will be sent to our Express route
			let user = await User.findOne(searchParams);
			if (!user) return next(null, false);
			else {
				// Compare encrypted passwords
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) throw err;
					if (isMatch) {
						return next(null, user);
					} else {
						return next({ message: "Incorrect password." }, false);
					}
				});
			}
		}
	)
);
// Simply logs in the user and sets the data stored inside the cookie
// Adding an auth property is unnecessary but easier to work with in React
passport.serializeUser((user, next) => {
	next(null, { _id: user._id, username: user.username, auth: true });
});
// Logs out the user
passport.deserializeUser((obj, next) => {
	next(null, obj);
});

module.exports = passport;
