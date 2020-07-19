import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@material-ui/core";
import { UserContext } from "../../utils/UserContext";
import clsx from "clsx";
import projectAPI from "../../utils/projectAPI";

const useStyles = makeStyles((theme) => ({
	formfield: {
		marginBottom: "1rem"
	}
}));

const ProjectDialog = ({ open, setOpen, reloadProjects }) => {
	const classes = useStyles();

	const [projectForm, setProjectForm] = useState({});
	const [errorForm, setErrorForm] = useState({});
	const { user } = useContext(UserContext);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setProjectForm({ ...projectForm, [name]: value.trim() });

		if (!value.trim()) {
			setErrorForm({ ...errorForm, [name]: true });
			// console.log("bad input");
		} else {
			// console.log("good input");
			setErrorForm({ ...errorForm, [name]: false });
		}
	};

	const handleCancel = () => {
		setProjectForm({});
		setErrorForm({ title: false, description: false });
		setOpen(false);
	};

	const handleSubmit = () => {
		console.log("submitting project: ", projectForm);
		console.log("current user", user);

		if (projectForm.title && projectForm.description) {
			setErrorForm({ title: false, description: false });
			projectAPI
				.createProject({
					title: projectForm.title,
					description: projectForm.description,
					creator: user._id
				})
				.then((res) => {
					console.log("project created successfully", res);
					setProjectForm({});
					setOpen(false);
					reloadProjects();
				})
				.catch((err) => console.error(err));
		} else {
			console.log("bad input on submit");
			setErrorForm({
				title: projectForm.title ? false : true,
				description: projectForm.description ? false : true
			});
		}
	};

	return (
		<Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="create-dialog-title">
			<DialogTitle id="create-dialog-title" onClose={() => setOpen(false)}>
				Create New Project
			</DialogTitle>
			<DialogContent dividers>
				<DialogContentText>
					Please enter the required information to create a new project.
				</DialogContentText>
				<form>
					<TextField
						required
						error={errorForm.title}
						helperText={
							errorForm.title ? "Required Field. Please enter valid data." : ""
						}
						size="small"
						className={clsx(classes.formfield)}
						label="Project Title"
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
						label="Project Description"
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
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ProjectDialog;
