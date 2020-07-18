import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import taskAPI from "../../utils/taskAPI";
import { Wrapper, Title } from "../../components/MiniComponents";
import {
	MenuItem,
	Box,
	Typography,
	Button,
	Divider,
	CircularProgress,
	Select
} from "@material-ui/core";
import moment from "moment";
import { TASK_NEW, TASK_TODO, TASK_WIP, TASK_REVIEW, TASK_DONE } from "../../utils/actions";
import TaskComments from "../../components/TaskComments";
import { UserContext } from "../../utils/UserContext";
// import ProjectNav from "../../components/ProjectNav";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex"
	},
	
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	}
}));


export default function Task() {
	const { user } = useContext(UserContext);
	const [open, setOpen] = useState(false);
	const [projectMembers, setProjectMembers] = useState([]);
	const [isMounted, setMounted] = useState(false);
	const [task, setTask] = useState({});
	const [comments, setComments] = useState([]);
	const [assignee, setAssignee] = useState("");
	const { project,id } = useParams();
	useEffect(() => {
		taskAPI
			.getTask(id)
			.then((res) => {
				console.log(res);
				setAssignee(res.task.assignedUser?._id);
				setTask(res.task);
				setComments(res.task.comments);
				setProjectMembers(res.members);
				setMounted(true);
			})
			.catch((err) => console.log(err));
	}, []);

	const handleChangeAssignee = (event) => {
		// console.log(id);
		taskAPI
			.updateTask(id, { assignedUser: event.target.value })
			.then((res) => setAssignee(res.assignedUser))
			.catch((err) => console.log(err));
	};
	const handleChangeStatus = (event) => {
		console.log(event.target.value);
	};

	return (
		<Container maxWidth="lg" component="main">
			<Wrapper>
				<Title>Task: {task.title}</Title>
				{isMounted ? (
					<div>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									variant="outlined"
									color="secondary"
									label="Created By:"
									value={task.creator?.firstName}
									InputProps={{
										readOnly: true
									}}
									helperText={
										"Create Date: " + moment(task.createdAt).format("M/DD/YYYY")
									}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								{projectMembers.length > 0 ? (
									<TextField
										variant="outlined"
										id="select-assignee"
										select
										label="Assigned To:"
										value={assignee}
										onChange={handleChangeAssignee}
										fullWidth>
										{projectMembers.map((user) => (
											<MenuItem key={user._id} value={user._id}>
												{user.firstName + " " + user.lastName}
											</MenuItem>
										))}
									</TextField>
								) : null}
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									fullWidth
									variant="outlined"
									label="Updated On:"
									value={"7/13/2020 at 5:54 P.M."}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									variant="outlined"
									id="select-assignee"
									select
									label="Status:"
									InputProps={{ defaultValue: task.status }}
									onChange={handleChangeStatus}
									fullWidth>
									{[TASK_NEW, TASK_TODO, TASK_WIP, TASK_REVIEW, TASK_DONE].map(
										(stat) => (
											<MenuItem key={stat} value={stat}>
												{stat}
											</MenuItem>
										)
									)}
								</TextField>
							</Grid>
						</Grid>
						<Divider style={{ margin: "1rem 0" }}></Divider>
						<Grid container justify="center" spacing={2}>
							<Grid item sm={12}>
								<Typography
									style={{ margin: "1rem 0" }}
									variant="h4"
									component="h2">
									Description
								</Typography>
								<Typography paragraph>{task.description}</Typography>
							</Grid>
						</Grid>
					</div>
				) : (
					<Grid container justify="center">
						<CircularProgress size="5rem" />
					</Grid>
				)}
			</Wrapper>
			<Grid container justify="flex-end">
				<Button>Save</Button>
			</Grid>
			<Wrapper style={{ marginTop: "1rem" }}>
				<Grid item sm={12}>
					<TaskComments
						taskId={task._id}
						comments={comments}
						setComments={setComments}
						user={user}
					/>
				</Grid>
			</Wrapper>
		</Container>
	);
}
