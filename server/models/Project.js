const { Schema, model, Types } = require("mongoose");
const Task = require('./Task');
const { TaskComment } = require(".");

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
			type: Schema.Types.ObjectId,
			ref: "Task"
		}
	],
	admins: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	],
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	],
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
});

ProjectSchema.post("deleteOne", async function (doc, next) {
	await Task.deleteMany({ project: doc._id })
	await TaskComment.deleteMany({ project: doc._id })
	next();
})

const Project = model("Project", ProjectSchema);

module.exports = Project;
