import React, { useState } from "react";
import { makeStyles, Menu, MenuItem, Grid } from "@material-ui/core";
import { Create, DeleteForever } from '@material-ui/icons'
import taskAPI from "../../utils/taskAPI";

const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.background.paper
    }
}))

/**
 * 
 * @param {Object} props
 * @param {string} props.taskId
 * @param {string} props.commentId
 * @param {Function} props.setComments
 * @param {Function} props.handleSetEdit
 * @param {{}[]} props.comments
 * @param {number} props.index
 */
const OptionsMenu = (props) => {
	const { taskId, commentId, comments, setComments, index, handleSetEdit, showEdit } = props;
	const classes = useStyles();
	const handleDeleteComment = async (taskId, commentId) => {
		console.log(commentId)
		let {
			flash: { type }
		} = await taskAPI.deleteComment(taskId, commentId);
		if (type === "success") setComments(comments.filter((c) => c._id !== commentId));
	};

	return (
		<Menu
			id="menu-comment"
			keepMounted
			PaperProps={{ className: classes.root }}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
			{...props}
		>
			{showEdit &&  (
				<MenuItem key="update-comment">
					<div onClick={() => handleSetEdit(index)}>
						<Grid container spacing={1} alignItems="flex-start">
							<Grid item>
								<Create />
							</Grid>
							<Grid item>Edit</Grid>
						</Grid>
					</div>
				</MenuItem>
			)}
            <MenuItem key="delete-comment">
				<div onClick={() => handleDeleteComment(taskId, commentId)}>
					<Grid container spacing={1} alignItems="flex-start">
						<Grid item>
							<DeleteForever />
						</Grid>
						<Grid item>Delete</Grid>
					</Grid>
				</div>
			</MenuItem>
		</Menu>
	);
};

export default OptionsMenu