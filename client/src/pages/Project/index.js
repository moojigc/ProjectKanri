import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import { makeStyles, Divider } from "@material-ui/core";
import { useParams } from "react-router-dom";
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
import { shadows } from "@material-ui/system";
import ProjectDialog from "../../components/ProjectDialog";
import TaskDialog from "../../components/TaskDialog";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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

const Project = () => {
	const classes = useStyles();
	const [project, setProject] = useState({});
	const [tasks, setTasks] = useState([]);
	const { id } = useParams();

	const [taskOpen, setTaskOpen] = useState(false);

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
							{STATARR.map((stat) => (
								<KanbanCol
									key={stat}
									status={stat}
									changeTaskStatus={changeTaskStatus}>
									<Typography variant="h6" component="h3">
										{stat}
									</Typography>
									<List dense>
										{tasks.length ? (
											tasks
												.filter((task) => task.status === stat)
												.map((task) => (
													<KanbanItem task={task}></KanbanItem>
												))
										) : (
											<ListItem>
												<ListItemText
													primary={"No tasks to do."}></ListItemText>
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
