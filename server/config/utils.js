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
	else next();
};

module.exports = { flash, serverError, isAuth };
