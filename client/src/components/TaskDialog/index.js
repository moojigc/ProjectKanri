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
import { set } from "mongoose";

const useStyles = makeStyles(theme => ({
    formfield: {
        marginBottom: "1rem"
    }
}))

const TaskDialog = ({ open, setOpen, reloadProject }) => {

    const classes = useStyles();
    
	const [taskForm, setTaskForm] = useState({});
	const { user, setUser } = useContext(UserContext);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
        setTaskForm({ ...taskForm, [name]: value });
    };
    
    const handleSubmit = () => {
        console.log("submitting task: ", taskForm);
		console.log("current user", user);
		reloadProject();
        setTaskForm({});
        setOpen(false);
    }

	return (
		<Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="create-dialog-title">
			<DialogTitle id="create-dialog-title" onClose={() => setOpen(false)}>Create Task</DialogTitle>
			<DialogContent dividers>
				<DialogContentText>
					Please enter the required information.
				</DialogContentText>
				<form>
					<TextField
                        required
                        size="small"
                        className= {clsx(classes.formfield)}
						label="Task Title"
						name="title"
						onChange={handleInputChange}
						variant="outlined"></TextField>
					<TextField
                        required
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
				<Button onClick={() => setOpen(false)} color="secondary">
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
