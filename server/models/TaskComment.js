const { Schema, model, Types } = require("mongoose");

const TaskCommentSchema = new Schema({
	body: {
		type: String,
		required: true,
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
	creator: {
		type: Types.ObjectId,
		required: true
	}
});
const TaskComment = model("TaskComment", TaskCommentSchema);

module.exports = TaskComment;
