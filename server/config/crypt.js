const bcrypt = require("bcryptjs");

// Turn bcrypt's hash func into a promise
module.exports = async (pass) => {
	return await new Promise((resolve, reject) => {
		bcrypt.hash(pass, 10, function (err, hash) {
			if (err) reject(err);
			resolve(hash);
		});
	});
};
