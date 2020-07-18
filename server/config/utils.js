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

module.exports = { flash, serverError };
