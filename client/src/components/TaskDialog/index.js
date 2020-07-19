import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, } from "@material-ui/core";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@material-ui/core";
import { UserContext } from "../../utils/UserContext";
import clsx from "clsx";
import taskAPI from "../../utils/taskAPI";

const useStyles = makeStyles((theme) => ({
	formfield: {
		marginBottom: "1rem"
	}
}));

const TaskDialog = ({ open, setOpen, reloadProject, projectId }) => {
	const classes = useStyles();

	const [taskForm, setTaskForm] = useState({});
	const [errorForm, setErrorForm] = useState({});
	const { user } = useContext(UserContext);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setTaskForm({ ...taskForm, [name]: value.trim() });
		if (!value.trim()) {
			setErrorForm({ ...errorForm, [name]: true });
			// console.log("bad input");
		} else {
			// console.log("good input");
			setErrorForm({ ...errorForm, [name]: false });
		}
	};

	const handleSubmit = () => {
		console.log("submitting task: ", taskForm);
		console.log("current user", user);
		if (taskForm.title && taskForm.description) {
			taskAPI
				.createTask(projectId, {
					...taskForm,
					creator: user._id
				})
				.then((res) => {
					reloadProject();
					setTaskForm({});
					setOpen(false);
				})
				.catch((err) => console.error(err));
		} else {
			console.log("bad input on submit");
			setErrorForm({
				title: taskForm.title ? false : true,
				description: taskForm.description ? false : true
			});
		}
	};

	const handleCancel = () => {
		setTaskForm({});
		setErrorForm({ title: false, description: false });
		setOpen(false);
	};

	return (
		<Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="create-dialog-title">
			<DialogTitle id="create-dialog-title" onClose={() => setOpen(false)}>
				Create Task
			</DialogTitle>
			<DialogContent dividers>
				<DialogContentText>Please enter the required information.</DialogContentText>
				<form>
					<TextField
						required
						error={errorForm.title}
						helperText={
							errorForm.title ? "Required Field. Please enter valid data." : ""
						}
						size="small"
						className={clsx(classes.formfield)}
						label="Task Title"
						name="title"
						onChange={handleInputChange}
						variant="outlined"></TextField>
					<TextField
						required
						error={errorForm.description}
						helperText={
							errorForm.description ? "Required Field. Please enter valid data." : ""
						}
						multiline
						fullWidth
						size="small"
						label="Task Description"
						rows={6}
						name="description"
						onChange={handleInputChange}
						variant="outlined"></TextField>
				</form>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="secondary">
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant="contained" color="primary">
					Create Task
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default TaskDialog;
