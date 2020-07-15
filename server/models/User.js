const crypt = require("../config/crypt");
const { Schema, model, Types } = require("mongoose");
const { emailRegex } = require("../../shared");

const UserSchema = new Schema({
	verified: {
		type: Boolean,
		required: true,
		default: false
	},
	firstName: {
		type: String,
		trim: true,
		required: true
	},
	lastName: {
		type: String,
		trim: true,
		required: true
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: false,
		match: [emailRegex, "Not a valid email."]
	},
	username: {
		type: String,
		unique: true,
		trim: true,
		required: true,
		validate: [({ length }) => length >= 3, "Username must be longer."]
	},
	password: {
		type: String,
		trim: true,
		required: true,
		validate: [({ length }) => length >= 8, "Password must be at least 8 characters."]
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});
// Add custom method on User to use our custom crypt method
UserSchema.methods.encryptPass = async function () {
	this.password = await crypt(this.password);
	return this;
};

const User = model("User", UserSchema);

module.exports = User;
