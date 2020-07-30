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
/**
 *
 * @param {import('express').Response} res
 */
const serverError = (res) => res.status(500).json(flash("Internal server error.", "error")).end();

const isAuth = (req, res, next) => {
	if (!req.user) return res.status(401).json(flash("Authorization error.", "error")).end();
	// imitate the database response for the guest user
	else if (req.user.username === "guest" && req.method !== "GET") {
		console.log("caught demo user, database will not update");
		let now = new Date();
		let response = {
			...req.body,
			updatedAt: req.method === "PUT" ? new Date() : now,
			createdAt: now,
			...flash("Guest user action blocked.", "success")
		};
		res.json(response).end();
	} else next();
};

module.exports = { flash, serverError, isAuth };
