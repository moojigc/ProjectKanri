import React from "react";
import moment from "moment";
import { Container, Typography as T, Avatar, Grid, Divider, Box } from "@material-ui/core";
/**
 *
 * @param {Object} props
 * @param {{ _id, body, createdAt, creator: { _id, username, firstName: string, lastName } }[]} props.comments
 */
const TaskComments = ({ user, comments = [] }) => {
	return (
		<Grid container spacing={2}>
			<Grid item container justify="center">
				<T variant="h5">COMMENTS</T>
			</Grid>
			<Box
				width="100%"
				padding="0.5rem 1rem"
				border="1px solid darkgray"
				borderRadius="0.15rem">
				{comments.map((comment, i, arr) => {
					return (
						<Grid style={{ padding: "0.25rem" }} item container alignItems="flex-end">
							<Avatar style={{ marginRight: "1rem" }}>
								{comment.creator.firstName.charAt(0)}
							</Avatar>
							<Grid item container></Grid>
							<T>{comment.body}</T>
							{i !== arr.length - 1 ? <Divider /> : null}
						</Grid>
					);
				})}
			</Box>
			<Grid item container>
				<Avatar>{user.username.charAt(0)}</Avatar>
			</Grid>
		</Grid>
	);
};

export default TaskComments;
