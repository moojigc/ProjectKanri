import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import taskAPI from "../../utils/taskAPI";
import { Wrapper, Title } from "../../components/MiniComponents";
import { MenuItem, Box, Typography, Button, Divider, CircularProgress } from "@material-ui/core";
import moment from "moment";
import { TASK_NEW, TASK_TODO, TASK_WIP, TASK_REVIEW, TASK_DONE } from "../../utils/actions";
import TaskComments from "../../components/TaskComments";
import { UserContext } from "../../utils/UserContext";
// const tempUsers = [
// 	{
// 		value: "001",
// 		label: "Pia"
// 	},

// 	{
// 		value: "002",
// 		label: "Moojig"
// 	},
// 	{
// 		value: "003",
// 		label: "Sam"
// 	}
// ];

export default function Task() {
	const { user } = useContext(UserContext);
	const [projectMembers, setProjectMembers] = useState([]);
	const [isMounted, setMounted] = useState(false);
	const [task, setTask] = useState({});
	const [assignee, setAssignee] = useState("");
	const { id } = useParams();
	useEffect(() => {
		taskAPI
			.getTask(id)
			.then((res) => {
				console.log(res);
				setAssignee(res.task.assignedUser?.firstName);
				setTask(res.task);
				setProjectMembers(res.members);
				setMounted(true);
			})
			.catch((err) => console.log(err));
	}, []);

	const handleChange = (event) => {
		setAssignee(event.target.value);
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
									color="textPrimary"
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
								<TextField
									variant="outlined"
									id="select-assignee"
									select
									label="Assigned To:"
									value={assignee}
									onChange={handleChange}
									fullWidth>
									{projectMembers.map((user) => (
										<MenuItem key={user._id} value={user.firstName}>
											{user.firstName + " " + user.lastName}
										</MenuItem>
									))}
								</TextField>
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
									onChange={handleChange}
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
					<CircularProgress />
				)}
			</Wrapper>
			<Grid container justify="flex-end">
				<Button>Save</Button>
			</Grid>
			<Wrapper style={{ marginTop: "1rem" }}>
				<Grid item sm={12}>
					<TaskComments comments={task.comments} user={user} />
				</Grid>
			</Wrapper>
		</Container>
	);
}
