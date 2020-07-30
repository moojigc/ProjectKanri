import React, { useEffect, useState, useContext, useCallback } from "react";
import { makeStyles, TextField, Button, CircularProgress, Menu, MenuItem, Divider } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import { UserContext } from "../../utils/UserContext";
import clsx from "clsx";
import { Title, Wrapper } from "../../components/MiniComponents";
import Container from "@material-ui/core/Container";
import { Grid, Typography } from "@material-ui/core/";
import { TASK_NEW, TASK_TODO, TASK_WIP, TASK_REVIEW, TASK_DONE } from "../../utils/actions";
import ProjectNav from "../../components/ProjectNav";
import TaskDialog from "../../components/TaskDialog";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Add, Settings, EditOutlined, PersonAdd, People, StarBorderOutlined, Delete } from "@material-ui/icons";
import { List, ListItemText, ListItem, Fab } from "@material-ui/core";
// import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";
import projectAPI from "../../utils/projectAPI";
import taskAPI from "../../utils/taskAPI";
import KanbanCol from "../../components/KanbanCol";
import KanbanItem from "../../components/KanbanItem";
import Markdown from "react-markdown";
import { useRef } from "react";
import moment from "moment";
import InviteModal from "../../components/InviteModal";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import OptionsMenu from "../../components/TaskComments/OptionsMenu";
import DeleteModal from "./DeleteModal";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex"
	},
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
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(2)
	},
	kanban: {
		minHeight: "50vh"
	},
	content: {
		flexGrow: 1,
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1)
	},
	editDescription: {
		backgroundColor: theme.palette.kone.light
	},
	paper: {
		background: theme.palette.background.default
	}
}));

const Project = () => {
	const history = useHistory();
	const classes = useStyles();
	const [project, setProject] = useState({});
	const [tasks, setTasks] = useState([]);
	const descriptionInput = useRef(null);
	const [editMode, setEditMode] = useState(false);
	const [flash, setFlash] = useState({ message: null, type: null });
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const { id } = useParams();
	const { user } = useContext(UserContext);

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
				default:
					break;
			}
		}
		return [todoTasks, wipTasks, reviewTasks, doneTasks];
	};
	const [mounted, setMounted] = useState(false);
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
				setMounted(true);
			})
			.catch((err) => console.error(err));
	};

	const changeTaskStatus = useCallback(
		(id, status) => {
			let task = tasks.find((task) => task._id === id);
			task = { ...task, status: status, updatedAt: new Date() };

			//call api to update task
			taskAPI
				.updateTask(id, task)
				.then(() => {
					setTasks(
						tasks.map((t) => ({
							...t,
							status: t._id === id ? status : t.status
						}))
					);
				})
				.catch((err) => console.error(err));
		},
		[tasks]
	);
	const handleDelete = async (event) => {
		event.preventDefault();
		let res = await projectAPI.delete(project._id);
		console.log(res);
		res.success ? history.push("/") : setFlash(res.flash);
	};

	const handleDescSubmit = async () => {
		let res = await projectAPI.updateDesc(descriptionInput.current.value, id);
		setEditMode(false);
		setProject({
			...project,
			description: res.description
		});
	};
	const [open, setOpen] = useState(false);
	const handleInvites = () => {
		setOpen(true);
	};

	return (
		<div className={clsx(classes.root)}>
			<ProjectNav projectId={id} />
			<InviteModal openInvite={open} setInviteOpen={setOpen} projectId={id} userIsAdmin={project.userIsAdmin} />
			<DeleteModal flash={flash} setOpen={setDeleteModalOpen} open={deleteModalOpen} onFormSubmit={handleDelete} />
			<Container disableGutters maxWidth="xl" component="main" className={clsx(classes.content)}>
				<Wrapper>
					<Title>{project.title || "Loading..."}</Title>
					{editMode ? (
						<Grid container>
							<TextField
								autoFocus
								inputRef={descriptionInput}
								required
								className={classes.editDescription}
								id="outlined-multiline-static"
								defaultValue={project.description}
								multiline
								fullWidth
								rows={5}
								variant="outlined"
							/>
						</Grid>
					) : mounted ? (
						<Grid container direction="column">
							<Typography variant="h5">
								Admins: <b>{project.admins?.map((a) => a.firstName + " " + a.lastName).join(", ")}</b>
							</Typography>
							<Divider />
							<Typography variant="caption">
								Started on <b>{moment(project.createdAt).format("M/DD/YYYY, h:mm A")}</b>
							</Typography>
							<Markdown source={project.description} />
						</Grid>
					) : (
						<Grid container justify="center">
							<CircularProgress aria-describedby="loading project" aria-busy={!mounted} color="secondary" size="6rem" />
						</Grid>
					)}
				</Wrapper>
				<Grid container justify="flex-end">
					{editMode ? (
						<React.Fragment>
							<Button color="secondary" onClick={() => setEditMode(false)}>
								Cancel
							</Button>
							<Button variant="contained" color="primary" style={{ marginLeft: "1rem" }} onClick={handleDescSubmit}>
								Submit
							</Button>
						</React.Fragment>
					) : project.userIsAdmin ? (
						<Grid item>
							<PopupState variant="popper" id="members">
								{(popupState) => (
									<React.Fragment>
										<Button style={{ marginRight: "1rem" }} {...bindTrigger(popupState)} startIcon={<People />}>
											Members
										</Button>
										<Menu
											id="menu-members"
											keepMounted
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "right"
											}}
											PaperProps={{ className: classes.paper }}
											transformOrigin={{
												vertical: "top",
												horizontal: "right"
											}}
											{...bindMenu(popupState)}
										>
											{project.members?.map((m) => (
												<MenuItem>
													<Grid container>
														{m.isAdmin ? (
															<React.Fragment>
																<Grid item>
																	<StarBorderOutlined />
																</Grid>
																<Grid item>{m.firstName + " " + m.lastName}</Grid>
															</React.Fragment>
														) : (
															<Grid item>{m.firstName + " " + m.lastName}</Grid>
														)}
													</Grid>
												</MenuItem>
											))}
										</Menu>
									</React.Fragment>
								)}
							</PopupState>
							<PopupState variant="popover" id="more-project-options">
								{(popupState) => (
									<React.Fragment>
										<Button color="secondary" variant="contained" {...bindTrigger(popupState)} startIcon={<Settings />}>
											Options
										</Button>
										<Menu
											id="menu-comment"
											keepMounted
											anchorOrigin={{
												vertical: "top",
												horizontal: "right"
											}}
											PaperProps={{ className: classes.paper }}
											transformOrigin={{
												vertical: "top",
												horizontal: "right"
											}}
											{...bindMenu(popupState)}
										>
											<MenuItem>
												<div onClick={() => setEditMode(true)}>
													<Grid container spacing={1} alignItems="flex-start">
														<Grid item>
															<EditOutlined />
														</Grid>
														<Grid item>Edit</Grid>
													</Grid>
												</div>
											</MenuItem>
											<MenuItem>
												<div onClick={handleInvites}>
													<Grid container spacing={1} alignItems="flex-start">
														<Grid item>
															<PersonAdd />
														</Grid>
														<Grid item>Invite</Grid>
													</Grid>
												</div>
											</MenuItem>
											{project.creator === user._id && (
												<MenuItem>
													<div onClick={() => setDeleteModalOpen(true)}>
														<Grid container spacing={1} alignItems="flex-start">
															<Grid item>
																<Delete />
															</Grid>
															<Grid item>Delete</Grid>
														</Grid>
													</div>
												</MenuItem>
											)}
										</Menu>
									</React.Fragment>
								)}
							</PopupState>
						</Grid>
					) : (
						// <React.Fragment>
						// 	<Button style={{ marginRight: "1rem" }} variant="contained" color="primary" onClick={() => setEditMode(true)}>
						// 		Edit
						// 	</Button>
						// 	<Button variant="contained" color="secondary" onClick={handleInvites}>
						// 		Invite
						// 	</Button>
						// </React.Fragment>
						<Button startIcon={<PersonAdd />} variant="contained" color="secondary" onClick={handleInvites}>
							Invite
						</Button>
					)}
				</Grid>

				<Wrapper className={clsx(classes.gridBackground)}>
					<DndProvider backend={HTML5Backend}>
						<Grid container spacing={2} className={clsx(classes.kanban)}>
							{mounted ? (
								returnOrganizedTasks(tasks).map(({ status, tasks }) => (
									<KanbanCol key={status} status={status} changeTaskStatus={changeTaskStatus}>
										<Typography variant="h6" component="h3">
											{status}
										</Typography>
										<List dense>
											{tasks.length ? (
												tasks.map((task) => <KanbanItem task={task} projectId={id} key={task._id}></KanbanItem>)
											) : (
												<ListItem>
													<ListItemText primary={"No tasks."}></ListItemText>
												</ListItem>
											)}
										</List>
									</KanbanCol>
								))
							) : (
								<Grid container justify="center">
									<CircularProgress aria-labelledby="loading tasks" aria-busy={!mounted} size="6rem" />
								</Grid>
							)}
						</Grid>
					</DndProvider>
				</Wrapper>
				<TaskDialog projectId={id} open={taskOpen} setOpen={setTaskOpen} reloadProject={loadProject}></TaskDialog>
				<Fab
					className={clsx(classes.fab)}
					color="secondary"
					variant="extended"
					onClick={() => {
						console.log("clicked");
						setTaskOpen(true);
					}}
				>
					<Add></Add>
					New Task
				</Fab>
			</Container>
		</div>
	);
};

export default Project;

/*



*/
