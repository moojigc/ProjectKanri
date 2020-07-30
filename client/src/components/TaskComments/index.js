import React, { useState, useRef } from "react";
import moment from "moment";
import { Typography as T, Avatar, Grid, Divider, Box, TextField, Button, Fade, IconButton } from "@material-ui/core";
import taskAPI from "../../utils/taskAPI";
import { MoreVert } from "@material-ui/icons";
import OptionsMenu from "./OptionsMenu";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import Markdown from "react-markdown";
/**
 *
 * @param {Object} props
 * @param {{ _id, username }} props.user
 * @param {{ _id, body, createdAt, editMode, updatedAt, creator: { _id, username, firstName: string, lastName } }[]} props.comments
 * @param {Function} props.setComments
 * @param {string} props.taskId
 * @param {string} props.projectId
 */
const TaskComments = ({ user, comments, setComments, taskId, projectId, admins }) => {
	const editCommentField = useRef(null);
	const [visible, setVisible] = useState(false);
	const commentField = useRef(null);
	const handleButtonVis = () => {
		setVisible(false);
		commentField.current.value = "";
		commentField.current.blur();
	};

	const handleCommentSubmit = async (event) => {
		event.preventDefault();
		console.log(taskId, commentField.current.value);
		let res = await taskAPI.postComment(taskId, { body: commentField.current.value, project: projectId });
		let newComment = {
			...res.comment,
			// Avoids a second db call in the backend
			creator: user
		};
		setComments([newComment].concat(comments));
		commentField.current.value = "";
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

	const handleSubmitEdit = async (event, id) => {
		event.preventDefault();
		let res = await taskAPI.editComment(taskId, id, editCommentField.current.value);
		setComments(
			comments.map((c) => {
				return {
					...c,
					body: c._id === id ? res.body : c.body,
					updatedAt: c._id === id ? res.updatedAt : c.updatedAt,
					editMode: false
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
						const { creator, body, createdAt, updatedAt } = comment;
						return (
							<li style={{ listStyle: "none" }} key={comment._id + i}>
								<Grid style={{ padding: "0.25rem" }} item container alignItems="flex-end">
									<Grid item container alignItems="center">
										<Avatar style={{ marginRight: "1rem", fontSize: "1rem" }}>
											{creator.firstName.charAt(0) + creator.lastName.charAt(0)}
										</Avatar>
										<div>
											<T variant="subtitle1" component="div" style={{ lineHeight: 1, fontWeight: 700 }}>
												{creator.firstName + " " + creator.lastName}{" "}
												{creator._id === user._id && <em style={{ fontSize: "smaller" }}>(You)</em>}
											</T>
											<T variant="caption" style={{ fontWeight: 100 }}>
												{moment(createdAt).fromNow()}
											</T>
										</div>
									</Grid>
									<Grid item container justify="space-between" alignItems="center">
										<Grid item style={{ flexGrow: 1 }}>
											{comment.editMode ? (
												<form onSubmit={(event) => handleSubmitEdit(event, comment._id)}>
													<TextField inputRef={editCommentField} defaultValue={body} fullWidth row={1} />
													<Grid style={{ marginTop: "0.25rem" }} container justify="flex-end">
														<Button onClick={handleSetEdit} style={{ marginRight: "0.5rem" }}>
															Cancel
														</Button>
														<Button type="submit" variant="contained" color="secondary">
															Edit
														</Button>
													</Grid>
												</form>
											) : (
												<React.Fragment>
													<T>
														<Markdown source={body} />
													</T>
													{!moment(updatedAt).isSame(createdAt) && (
														<T component="span" style={{ fontSize: "small" }}>
															<em>Edited {moment(updatedAt).fromNow()}</em>
														</T>
													)}
												</React.Fragment>
											)}
										</Grid>
										{(creator._id === user._id || admins.includes(user._id)) && (
											<Grid item>
												<PopupState variant="popover" id="more-comment-options">
													{(popupState) => (
														<React.Fragment>
															<IconButton {...bindTrigger(popupState)}>
																<MoreVert />
															</IconButton>
															<OptionsMenu
																{...bindMenu(popupState)}
																showEdit={creator._id === user._id}
																index={i}
																comments={comments}
																setComments={setComments}
																taskId={taskId}
																commentId={comment._id}
																handleSetEdit={handleSetEdit}
															/>
														</React.Fragment>
													)}
												</PopupState>
											</Grid>
										)}
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
