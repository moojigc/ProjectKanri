import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import Face from "@material-ui/icons/Face";
import Lock from "@material-ui/icons/Lock";
import Send from "@material-ui/icons/Send";
import userApi from "../../utils/userAPI";
import Wrapper from "../../components/Wrapper";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useUserContext } from "../../utils/UserContext";
import taskAPI from "../../utils/taskAPI";
import Title from "../../components/Title";
import { MenuItem, Box } from "@material-ui/core";

const tempUsers = [
	{
		value: "001",
		label: "Pia"
	},

	{
		value: "002",
		label: "Moojig"
	},
	{
		value: "003",
		label: "Sam"
	}
];

export default function Task() {
	const [task, setTask] = useState({});
	const [assignee, setAssignee] = useState("001");
	const { id } = useParams();
	useEffect(() => {
		taskAPI
			.getTask(id)
			.then((res) => setTask(res.data))
			.catch((err) => console.log(err));
	}, []);

	const handleChange = (event) => {
		setAssignee(event.target.value);
	};

	return (
		<Container maxWidth="lg" component="main">
			<Wrapper>
				<Title>Task</Title>
				<Grid container justify="center" spacing={2}>
					<Grid item sm={10}>
						<TextField
							color="textPrimary"
							disabled
							value="Pia"
							label="Created By:"
							helperText="7/8/2020"
						/>

						<TextField
							style={{ width: "3rem" }}
							id="select-assignee"
							select
							label="Assigned To"
							value={assignee}
							onChange={handleChange}>
							{tempUsers.map((user) => (
								<MenuItem key={user.value} value={user.value}>
									{user.label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item sm={2}></Grid>
				</Grid>
				<Grid container justify="center" spacing={2}>
					<Grid item sm={12}>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the
						1500s, when an unknown printer took a galley of type and scrambled it to
						make a type specimen book. It has survived not only five centuries, but also
						the leap into electronic typesetting, remaining essentially unchanged. It
						was popularised in the 1960s with the release of Letraset sheets containing
						Lorem Ipsum passages, and more recently with desktop publishing software
						like Aldus PageMaker including versions of Lorem Ipsum.
					</Grid>
				</Grid>
			</Wrapper>
			<Wrapper style={{ marginTop: "1rem" }}>
				<Grid item sm={12}>
					{" "}
				</Grid>
			</Wrapper>
		</Container>
	);
}
