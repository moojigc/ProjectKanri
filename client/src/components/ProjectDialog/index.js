import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Button, Typography, Grid, InputAdornment } from "@material-ui/core";
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
	const { user, setUser } = useContext(UserContext);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setProjectForm({ ...projectForm, [name]: value });
	};

	const handleSubmit = () => {
		console.log("submitting project: ", projectForm);
		console.log("current user", user);
		let newProject = {
			title: projectForm.title,
			description: projectForm.description,
			creator: user._id
		};
		projectAPI
			.createProject(newProject)
			.then((res) => {
				console.log("project created successfully", res);
			})
			.catch((err) => console.error(err));

		setProjectForm({});
		setOpen(false);
		reloadProjects();
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
						size="small"
						className={clsx(classes.formfield)}
						label="Project Title"
						name="title"
						onChange={handleInputChange}
						variant="outlined"></TextField>
					<TextField
						required
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
				<Button onClick={() => setOpen(false)} color="secondary">
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
