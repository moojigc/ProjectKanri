import React, { useEffect, useState, useContext } from "react";
import { makeStyles, Divider } from "@material-ui/core";
import { useParams } from "react-router-dom";
import moment from "moment";
import clsx from "clsx";
// import { Wrapper } from "../../components/MiniComponents";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import Container from "@material-ui/core/Container";
import { Grid, Typography } from "@material-ui/core/";
import { TASK_NEW, TASK_TODO, TASK_WIP, TASK_REVIEW, TASK_DONE } from "../../utils/actions";
import { shadows } from "@material-ui/system";
import ProjectDialog from "../../components/ProjectDialog";
import TaskDialog from "../../components/TaskDialog"
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
import projectAPI from "../../utils/projectAPI";
import { set } from "mongoose";
// import taskAPI from "../../utils/taskAPI";

const useStyles = makeStyles((theme) => ({
	taskOutline: {
		border: "1px gray",
		boxShadow: "1px 2px 2px 1px rgba(97, 108, 153, .3)",
		marginBottom: "1rem"
		// padding: theme.spacing(2)
	},
	gridBackground: {
		backgroundColor: "transparent"
	},
	fab: {
		position: "absolute",
		bottom: theme.spacing(2),
		right: theme.spacing(2)
	}
}));

const Project = () => {
	const classes = useStyles();
	const [project, setProject] = useState({});
	const [tasks, setTasks] = useState([]);
	const { id } = useParams();

	const [taskOpen, setTaskOpen] = useState(false);

	const returnOrganizedTasks = (tasks = []) => {
		const todoTasks = {
			status: TASK_TODO,
			tasks: []
		};
		const wipTasks = {
			status: TASK_WIP,
			tasks: []
		};
		const reviewTasks = {
			status: TASK_REVIEW,
			tasks: []
		};
		const doneTasks = {
			status: TASK_DONE,
			tasks: []
		};
		for (let i = 0; i < tasks.length; i++) {
			switch (tasks[i].status) {
				case TASK_TODO:
					todoTasks.tasks.push(tasks[i]);
					break;
				case TASK_WIP:
					wipTasks.tasks.push(tasks[i]);
					break;
				case TASK_REVIEW:
					reviewTasks.tasks.push(tasks[i]);
					break;
				case TASK_DONE:
					doneTasks.tasks.push(tasks[i]);
					break;
			}
		}
		return [todoTasks, wipTasks, reviewTasks, doneTasks];
	};

	useEffect(() => {
		projectAPI
			.getProject(id)
			.then((res) => {
				setProject(res);
				console.log("tasks", res.tasks);
				setTasks(res.tasks);
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<React.Fragment>
			<Container maxWidth="xl" component="main">
				<Wrapper>
					<Title>{project.title}</Title>
					<Typography paragraph>{project.description}</Typography>
				</Wrapper>
				<Wrapper className={clsx(classes.gridBackground)}>
					<Grid container spacing={2}>
						{returnOrganizedTasks(tasks).map(({ status, tasks }) => {
							return (
								<Grid item xs={12} sm={6} md={3} key={status}>
									<Typography variant="h6" component="h3">
										{status}
									</Typography>
									<List dense>
										{tasks.length ? (
											tasks.map((task) => {
												return (
													<ListItem
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
																"Updated: " +
																moment(task.updatedAt).format(
																	"D-MMM-YYYY"
																)
															}></ListItemText>
														<ListItemSecondaryAction>
															<IconButton
																edge="end"
																aria-label="Go to task"
																onClick={() =>
																	window.location.replace(
																		`/task/${task._id}`
																	)
																}>
																<ArrowForward></ArrowForward>
															</IconButton>
														</ListItemSecondaryAction>
													</ListItem>
												);
											})
										) : (
											<ListItem>
												<ListItemText
													primary={"No tasks to do."}></ListItemText>
											</ListItem>
										)}
									</List>
								</Grid>
							);
						})}
					</Grid>
				</Wrapper>
				<TaskDialog open={taskOpen} setOpen={setTaskOpen}></TaskDialog>
				<Fab
					className={clsx(classes.fab)}
					color="secondary"
					variant="extended"
					onClick={() => {
						console.log("clicked");
						setTaskOpen(true);
					}}>
					<Add></Add>
					New Task
				</Fab>
			</Container>
		</React.Fragment>
	);
};

export default Project;
