const { Schema, model, Types } = require("mongoose");

const ProjectSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		validate: [({ length }) => length >= 1, "Must not be an empty string."]
	},
	description: {
		type: String,
		required: false,
		trim: true,
		validate: [({ length }) => length >= 1, "Must not be empty string."]
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	tasks: [
		{
			type: Types.ObjectId,
			ref: "Task"
		}
	],
	admins: [
		{
			type: Types.ObjectId,
			ref: "User"
		}
	],
	members: [
		{
			type: Types.ObjectId,
			ref: "User"
		}
	],
	creator: {
		type: Types.ObjectId,
		ref: "User",
		required: true
	}
});
const Project = model("Project", ProjectSchema);

module.exports = Project;
