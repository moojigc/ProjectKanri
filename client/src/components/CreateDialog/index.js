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

const CreateDialog = ({ open, setOpen }) => {

    const classes = useStyles();
    
	const [projectForm, setProjectForm] = useState({});
	const { setUser } = useContext(UserContext);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
        setProjectForm({ ...projectForm, [name]: value });
    };
    
    const handleSubmit = () => {
        console.log("submitting: ", projectForm);
        setProjectForm({});
        setOpen(false);
    }

	return (
		<Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="create-dialog-title">
			<DialogTitle id="create-dialog-title" onClose={() => setOpen(false)}>Create New Project</DialogTitle>
			<DialogContent dividers>
				<DialogContentText>
					Please enter the required information to create a new project.
				</DialogContentText>
				<form>
					<TextField
                        required
                        size="small"
                        className= {clsx(classes.formfield)}
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

export default CreateDialog;
