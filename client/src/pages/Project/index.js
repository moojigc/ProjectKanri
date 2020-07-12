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
import {
	Assignment,
	AssignmentInd,
	AssignmentLate,
	AssignmentTurnedIn,
	ArrowForward
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
	IconButton
} from "@material-ui/core";
import projectAPI from "../../utils/projectAPI";
// import taskAPI from "../../utils/taskAPI";

const useStyles = makeStyles((theme) => ({
	taskOutline: {
		border: "1px gray",
		boxShadow: "1px 2px 2px 1px rgba(97, 108, 153, .3)",
		marginBottom: "1rem"
		// padding: theme.spacing(2)
	}
}));

const Project = () => {
	const classes = useStyles();
	const [project, setProject] = useState({});
	const [todoTasks, setTodoTasks] = useState([]);
	const [wipTasks, setWIPTasks] = useState([]);
	const [reviewTasks, setReviewTasks] = useState([]);
	const [doneTasks, setDoneTasks] = useState([]);
	const { id } = useParams();

	useEffect(() => {
		projectAPI
			.getProject(id)
			.then((res) => {
				setProject(res);
				console.log("tasks", res.tasks);
				const todos = res.tasks.filter((task) => task.status === TASK_TODO);
				const wips = res.tasks.filter((task) => task.status === TASK_WIP);
				const reviews = res.tasks.filter((task) => task.status === TASK_REVIEW);
				const dones = res.tasks.filter((task) => task.status === TASK_DONE);
				setTodoTasks(todos);
				setWIPTasks(wips);
				setReviewTasks(reviews);
				setDoneTasks(dones);
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<Container maxWidth="xl" component="main">
			<Wrapper>
				<Title>{project.title}</Title>
				<Typography paragraph>{project.description}</Typography>
			</Wrapper>
			<Wrapper>
				<Typography paragraph>Under Construction</Typography>
				<Grid container spacing={2}>
					{/* TO DO TASKS */}
					<Grid item xs={12} sm={6} md={3} >
						<Typography variant="h6" component="h3">
							To Do
						</Typography>
						<List>
							{todoTasks.length ? (
								todoTasks.map((task) => {
									return (
										<ListItem
											key={task._id}
											boxShadow={1}
											className={clsx(classes.taskOutline)}>
											<ListItemAvatar>
												<Avatar>
													<Assignment></Assignment>
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={task.title}
												secondary={"Updated: " + moment(task.updatedAt).format(
													"D-MMM-YYYY"
												)}></ListItemText>
											<ListItemSecondaryAction>
												<IconButton
													edge="end"
													aria-label="Go to task"
													onClick={() =>
														window.location.replace(`/task/${task._id}`)
													}>
													<ArrowForward></ArrowForward>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									);
								})
							) : (
								<ListItem>
									<ListItemText primary={"No tasks to do."}></ListItemText>
								</ListItem>
							)}
						</List>
					</Grid>
					{/* <Divider orientation="vertical" flexItem></Divider> */}
					{/* IN PROGRESS TASKS */}
					<Grid item xs={12} sm={6} md={3}>
						<Typography variant="h6" component="h3">
							In Progress
						</Typography>
						<List>
							{wipTasks.length ? (
								wipTasks.map((task) => {
									return (
										<ListItem
											key={task._id}
											boxShadow={1}
											className={clsx(classes.taskOutline)}>
											<ListItemAvatar>
												<Avatar>
													<AssignmentInd></AssignmentInd>
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={task.title}
												secondary={"Updated: " + moment(task.updatedAt).format(
													"D-MMM-YYYY"
												)}></ListItemText>
											<ListItemSecondaryAction>
												<IconButton
													edge="end"
													aria-label="Go to task"
													onClick={() =>
														window.location.replace(`/task/${task._id}`)
													}>
													<ArrowForward></ArrowForward>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									);
								})
							) : (
								<ListItem>
									<ListItemText primary={"No tasks in progress."}></ListItemText>
								</ListItem>
							)}
						</List>
					</Grid>
					{/* <Divider orientation="vertical" flexItem></Divider> */}
					{/* IN REVIEW TASKS */}
					<Grid item xs={12} sm={6} md={3}>
						<Typography variant="h6" component="h3">
							In Review
						</Typography>
						<List>
							{reviewTasks.length ? (
								reviewTasks.map((task) => {
									return (
										<ListItem
											key={task._id}
											boxShadow={1}
											className={clsx(classes.taskOutline)}>
											<ListItemAvatar>
												<Avatar>
													<AssignmentLate></AssignmentLate>
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={task.title}
												secondary={"Updated: " + moment(task.updatedAt).format(
													"D-MMM-YYYY"
												)}></ListItemText>
											<ListItemSecondaryAction>
												<IconButton
													edge="end"
													aria-label="Go to task"
													onClick={() =>
														window.location.replace(`/task/${task._id}`)
													}>
													<ArrowForward></ArrowForward>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									);
								})
							) : (
								<ListItem>
									<ListItemText primary={"No tasks in review."}></ListItemText>
								</ListItem>
							)}
						</List>
					</Grid>
					{/* <Divider orientation="vertical" flexItem></Divider> */}
					{/* DONE TASKS */}
					<Grid item xs={12} sm={6} md={3}>
						<Typography variant="h6" component="h3">
							Done
						</Typography>
						<List>
							{doneTasks.length ? (
								doneTasks.map((task) => {
									return (
										<ListItem
											key={task._id}
											boxShadow={1}
											className={clsx(classes.taskOutline)}>
											<ListItemAvatar>
												<Avatar>
													<AssignmentTurnedIn></AssignmentTurnedIn>
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={task.title}
												secondary={"Updated: " + moment(task.updatedAt).format(
													"D-MMM-YYYY"
												)}></ListItemText>
											<ListItemSecondaryAction>
												<IconButton
													edge="end"
													aria-label="Go to task"
													onClick={() =>
														window.location.replace(`/task/${task._id}`)
													}>
													<ArrowForward></ArrowForward>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									);
								})
							) : (
								<ListItem>
									<ListItemText primary={"No tasks completed."}></ListItemText>
								</ListItem>
							)}
						</List>
					</Grid>
				</Grid>
			</Wrapper>
		</Container>
	);
};

export default Project;
