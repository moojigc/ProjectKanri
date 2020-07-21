import React, { useState, useRef } from "react";
import moment from "moment";
import { Typography as T, Avatar, Grid, Divider, Box, TextField, Button, Fade, IconButton } from "@material-ui/core";
import taskAPI from "../../utils/taskAPI";
import { MoreVert } from "@material-ui/icons";
import OptionsMenu from "./OptionsMenu";
/**
 *
 * @param {Object} props
 * @param {{ _id, username }} props.user
 * @param {{ _id, body, createdAt, editMode, creator: { _id, username, firstName: string, lastName } }[]} props.comments
 * @param {Function} props.setComments
 * @param {string} props.taskId
 */
const TaskComments = ({ user, comments, setComments, taskId }) => {
	const [visible, setVisible] = useState(false);
	const [moreOptionsAnchorEl, setMoreOptionsAnchorEl] = useState(null);
	const commentField = useRef(null);
	const handleButtonVis = () => {
		setVisible(false);
		commentField.current.value = "";
		commentField.current.blur();
	};

	const handleCommentSubmit = async (event) => {
		event.preventDefault();
		console.log(taskId, commentField.current.value);
		let res = await taskAPI.postComment(taskId, { body: commentField.current.value });
		let newComment = {
			...res.comment,
			// Avoids a second db call in the backend
			creator: user
		};
		setComments([newComment].concat(comments));
		commentField.current.value = "";
	};

	const handleDeleteComment = async (taskId, commentId) => {
		setMoreOptionsAnchorEl(null);
		let {
			flash: { type }
		} = await taskAPI.deleteComment(taskId, commentId);
		if (type === "success") setComments(comments.filter((c) => c._id !== commentId));
	};

	const handleSetEdit = (index) => {
		setComments(
			comments.map((c, i) => {
				return {
					...c,
					editMode: i === index ? !c.editMode : false
				};
			})
		);
	};

	return (
		<Grid container spacing={2}>
			<Grid item container justify="center">
				<T variant="h5">
					{comments.length} COMMENT{comments.length === 1 ? "" : "S"}
				</T>
			</Grid>
			<form onSubmit={handleCommentSubmit} style={{ width: "100%", padding: "0.5rem 1rem" }}>
				<Grid item container style={{ padding: "0.25rem" }} alignItems="flex-end" justify="space-between">
					<Avatar style={{ marginRight: "1rem" }}>{user.username.charAt(0)}</Avatar>
					<Box flex="auto">
						<TextField inputRef={commentField} color="secondary" onFocus={() => setVisible(true)} fullWidth label="Add a comment" />
					</Box>
				</Grid>
				<Fade in={visible} style={{ marginBottom: visible ? null : "-2rem" }}>
					<Grid container justify="flex-end" style={{ padding: "0.25rem" }}>
						<Button onClick={() => handleButtonVis(false)}>Cancel</Button>
						<Button type="submit" variant="contained">
							Comment
						</Button>
					</Grid>
				</Fade>
			</form>
			{comments.length ? (
				<Box component="ul" width="100%" padding="0.5rem 1rem" border="1px solid darkgray" borderRadius="0.15rem">
					{comments.map((comment, i, arr) => {
						const { creator, body, createdAt } = comment;
						return (
							<li style={{ listStyle: "none" }} key={comment._id + i}>
								<Grid style={{ padding: "0.25rem" }} item container alignItems="flex-end">
									<Grid item container alignItems="center">
										<Avatar style={{ marginRight: "1rem", fontSize: "1rem" }}>
											{creator.firstName.charAt(0) + creator.lastName.charAt(0)}
										</Avatar>
										<div>
											<T variant="subtitle1" component="div" style={{ lineHeight: 1, fontWeight: 700 }}>
												{creator.firstName + " " + creator.lastName}
											</T>
											<T variant="caption" style={{ fontWeight: 100 }}>
												{moment(createdAt).fromNow()}
											</T>
										</div>
									</Grid>
									<Grid item container justify="space-between" alignItems="center">
										<Grid item>
											<T>{body}</T>
										</Grid>
										<Grid item>
											<IconButton onClick={(event) => setMoreOptionsAnchorEl(event.currentTarget)}>
												<MoreVert />
											</IconButton>
											<OptionsMenu
												setAnchorEl={setMoreOptionsAnchorEl}
												anchorEl={moreOptionsAnchorEl}
												handleDeleteComment={() => handleDeleteComment(taskId, comment._id)}
											/>
										</Grid>
									</Grid>
								</Grid>
								{i !== arr.length - 1 ? <Divider style={{ margin: "0.5rem 0" }} /> : null}
							</li>
						);
					})}
				</Box>
			) : null}
		</Grid>
	);
};

export default TaskComments;
