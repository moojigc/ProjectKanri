const { Schema, model, Types } = require("mongoose");
const TaskComment = require("./TaskComment")

const TaskSchema = new Schema({
	project: {
		type: Schema.Types.ObjectId,
		ref: "Project",
		required: true
	},
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
	comments: [
		{
			type: Types.ObjectId,
			ref: "TaskComment"
		}
	],
	creator: {
		type: Types.ObjectId,
		ref: "User",
		required: true
	},
	assignedUser: {
		type: Types.ObjectId,
		ref: "User"
	},
	status: {
		type: String,
		enum: ["New", "To Do", "In Progress", "In Review", "Completed"],
		default: "New",
		required: true
	}
});

TaskSchema.post("deleteOne", async function (doc, next) {
	await TaskComment.deleteMany({
		_id: {
			$in: doc.comments
		}
	})
	next();
})

const Task = model("Task", TaskSchema);

module.exports = Task;
