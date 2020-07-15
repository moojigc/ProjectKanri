import React, { useState, useEffect } from "react";
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

const CreateDialog = ({ open, setOpen }) => {
	const [projectForm, setProjectForm] = useState({});
	const { setUser } = useContext(UserContext);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setProjectForm({ ...projectForm, [name]: value });
    };
    
    const handleSubmit = () => {
        console.log("submitting: ", projectForm);
    }

	return (
		<Dialog open={open} onClose={setOpen(false)} aria-labelledby="create-dialog-title">
			<DialogTitle id="create-dialog-title">Create New Project</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Please enter the required information to create a new project.
				</DialogContentText>
				<form>
					<TextField
						required
						label="Project Title"
						name="title"
						onChange={handleInputChange}
						variant="outlined"></TextField>
					<TextField
						required
						fullWidth
						label="Project Description"
						rows={4}
						name="description"
						onChange={handleInputChange}
						variant="outlined"></TextField>
				</form>
			</DialogContent>
			<DialogActions>
				<Button onClick={setOpen(false)} color="secondary">
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant="contained" color="primary">
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateDialog;
