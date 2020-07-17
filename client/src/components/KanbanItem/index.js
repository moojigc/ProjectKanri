import React, { useState, useCallback, useRef } from "react";
import { makeStyles, Divider } from "@material-ui/core";
import { ItemTypes } from "../../utils/actions";
import clsx from "clsx";
import moment from "moment";
import { DndProvider, useDrag, useDrop } from "react-dnd";

import {
	Assignment,
	AssignmentInd,
	AssignmentLate,
	AssignmentTurnedIn,
	ArrowForward,
	Add
} from "@material-ui/icons";
import {
	List,
	ListItemText,
	ListItemIcon,
	ListItemAvatar,
	ListItem,
	Link,
	Avatar,
	ListItemSecondaryAction,
	IconButton,
	Fab
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	taskOutline: {
		border: "1px gray",
		boxShadow: "1px 2px 2px 1px rgba(97, 108, 153, .3)",
		marginBottom: "1rem"
		// padding: theme.spacing(2)
	}
}));

const KanbanItem = ({ task }) => {
	const classes = useStyles();
	const ref = useRef(null);

	const [{ isDragging }, drag] = useDrag({
		item: { type: ItemTypes.DTASK, id: task._id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	});
	const opacity = isDragging ? 0 : 1;
	drag(ref);
	return (
		<ListItem
			ref={ref}
			style={{ opacity }}
			key={task._id}
			// boxShadow={1}
			className={clsx(classes.taskOutline)}>
			<ListItemAvatar>
				<Avatar>
					<Assignment></Assignment>
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={task.title}
				secondary={
					"Updated: " + moment(task.updatedAt).format("D-MMM-YYYY")
				}></ListItemText>
			<ListItemSecondaryAction>
				<IconButton
					edge="end"
					aria-label="Go to task"
					onClick={() => window.location.replace(`/task/${task._id}`)}>
					<ArrowForward></ArrowForward>
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default KanbanItem;