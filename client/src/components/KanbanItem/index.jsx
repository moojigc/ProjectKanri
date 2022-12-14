import React, { useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { ItemTypes } from "../../utils/actions";
import clsx from "clsx";
import moment from "moment";
import { useDrag } from "react-dnd";
import { Assignment, ArrowForward } from "@material-ui/icons";
import { ListItemText, ListItemAvatar, ListItem, Avatar, ListItemSecondaryAction, IconButton, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	taskOutline: {
		border: "1px gray",
		boxShadow: "1px 2px 2px 1px rgba(97, 108, 153, .3)",
		marginBottom: "1rem",
		backgroundColor: theme.palette.kone.light
		// padding: theme.spacing(2)
	},
	inline: {
		display: "inline"
	},
	avatar: {
		// border: "none",
		backgroundColor: theme.palette.secondary.main,
		borderColor: theme.palette.secondary.light
	}
}));

const KanbanItem = ({ projectId, task }) => {
	const classes = useStyles();
	const ref = useRef(null);

	const [{ isDragging }, drag] = useDrag({
		item: { type: ItemTypes.DTASK, id: task._id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	});

	// console.log(task.assignedUser);

	const opacity = isDragging ? 0 : 1;
	drag(ref);
	return (
		<ListItem
			ref={ref}
			style={{ opacity }}
			key={task._id}
			// boxShadow={1}
			className={clsx(classes.taskOutline)}
		>
			<ListItemAvatar>
				{task.assignedUser ? (
					<Tooltip arrow title={`${task.assignedUser.firstName} ${task.assignedUser.lastName} `}>
						<Avatar style={{ fontSize: "1rem" }} className={classes.avatar} alt={`${task.assignedUser.firstName} ${task.assignedUser.lastName} `}>
						{task.assignedUser.firstName.charAt(0) + task.assignedUser.lastName.charAt(0)}
						</Avatar>
					</Tooltip>
				) : (
					<Avatar>
						<Assignment></Assignment>
					</Avatar>
				)}
			</ListItemAvatar>
			<ListItemText primary={task.title} secondary={"Updated: " + moment(task.updatedAt).format("D-MMM-YYYY")}></ListItemText>
			<ListItemSecondaryAction>
				<RouterLink to={`/project/${projectId}/task/${task._id}`}>
					<IconButton edge="end" aria-label="Go to task">
						<ArrowForward />
					</IconButton>
				</RouterLink>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default KanbanItem;
