const bcrypt = require("bcryptjs");

/**
 * Turn bcrypt's hash func into a promise
 * @param {string} pass
 * @param {string} hash
 */
module.exports = async (pass, hash) => {
	if (hash) {
		return await bcrypt.compare(pass, hash);
	} else {
		return await new Promise((resolve, reject) => {
			bcrypt.hash(pass, 10, function (err, hash) {
				if (err) reject(err);
				resolve(hash);
			});
		});
	}
};
