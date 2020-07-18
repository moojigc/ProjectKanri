import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import { makeStyles, Divider } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { UserContext } from "../../utils/UserContext";
import moment from "moment";
import clsx from "clsx";
// import { Wrapper } from "../../components/MiniComponents";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import Container from "@material-ui/core/Container";
import { Grid, Typography } from "@material-ui/core/";
import {
	TASK_NEW,
	TASK_TODO,
	TASK_WIP,
	TASK_REVIEW,
	TASK_DONE,
	STATARR,
	STATMAP
} from "../../utils/actions";
import TaskDialog from "../../components/TaskDialog";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
	Assignment,
	// AssignmentInd,
	// AssignmentLate,
	// AssignmentTurnedIn,
	// ArrowForward,
	Add,
	PersonAdd,
	PeopleAlt,
	SupervisedUserCircle
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

import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";

import projectAPI from "../../utils/projectAPI";
import taskAPI from "../../utils/taskAPI";
import KanbanCol from "../../components/KanbanCol";
import KanbanItem from "../../components/KanbanItem";

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
	},
	kanban: {
		minHeight: "50vh"
	}
}));

const adminActions = [
	{
		icon: <SupervisedUserCircle />,
		name: "Add Member"
	},
	{
		icon: <Assignment />,
		name: "Add Task"
	}
];

const memActions = [
	{
		icon: <Assignment />,
		name: "Add Task"
	}
];

const Project = () => {
	const classes = useStyles();
	const [project, setProject] = useState({});
	const [tasks, setTasks] = useState([]);
	const { id } = useParams();
	const { user } = useContext(UserContext);
	const [actions, setActions] = useState([]);

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
				case TASK_NEW:
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
		loadProject();
	}, []);

	const loadProject = () => {
		projectAPI
			.getProject(id)
			.then((res) => {
				setProject(res);
				console.log("tasks", res.tasks);
				setTasks(res.tasks);
			})
			.catch((err) => console.error(err));
	};

	const changeTaskStatus = useCallback(
		(id, status) => {
			let task = tasks.find((task) => task._id === id);
			task = { ...task, status: status };

			//call api to update task
			taskAPI
				.updateTask(id, task)
				.then((res) => {
					console.log("updated task", res);
					loadProject();
				})
				.catch((err) => console.error(err));
		},
		[tasks]
	);

	if (project.admins.includes(user._id)) {
		setActions(adminActions);
	} else {
		setActions(memActions);
	}

	// const handleActions = (action) => {
	// 	switch (action){
	// 		case: ""

	// 	}
	// }

	return (
		<React.Fragment>
			<Container maxWidth="xl" component="main">
				<Wrapper>
					<Title>{project.title}</Title>
					<Typography paragraph>{project.description}</Typography>
				</Wrapper>
				<Wrapper className={clsx(classes.gridBackground)}>
					<DndProvider backend={HTML5Backend}>
						<Grid container spacing={2} className={clsx(classes.kanban)}>
							{returnOrganizedTasks(tasks).map(({ status, tasks }) => (
								<KanbanCol
									key={status}
									status={status}
									changeTaskStatus={changeTaskStatus}>
									<Typography variant="h6" component="h3">
										{status}
									</Typography>
									<List dense>
										{tasks.length ? (
											tasks
												// .filter((task) => task.status === stat)
												.map((task) => (
													<KanbanItem
														task={task}
														key={task._id}></KanbanItem>
												))
										) : (
											<ListItem>
												<ListItemText primary={"No tasks."}></ListItemText>
											</ListItem>
										)}
									</List>
								</KanbanCol>
							))}
						</Grid>
					</DndProvider>
				</Wrapper>
				<TaskDialog
					open={taskOpen}
					setOpen={setTaskOpen}
					reloadProject={loadProject}></TaskDialog>
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

/*



*/
