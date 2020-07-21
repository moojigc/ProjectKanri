import React, { useState } from "react";
import { makeStyles, Menu, MenuItem, Grid } from "@material-ui/core";
import { Create, DeleteForever } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.background.paper
    }
}))

const OptionsMenu = ({anchorEl, setAnchorEl, handleUpdateComment, handleDeleteComment}) => {
    const classes = useStyles();
    const open = Boolean(anchorEl);
	return (
		<Menu
			id="menu-comment"
			anchorEl={anchorEl}
			PaperProps={{ className: classes.root }}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
			open={open}
            onClose={() => setAnchorEl(null)}
		>
			<MenuItem key="update-comment">
				<div onClick={handleUpdateComment}>
					<Grid container spacing={1} alignItems="flex-start">
						<Grid item>
							<Create />
						</Grid>
						<Grid item>Edit</Grid>
					</Grid>
				</div>
			</MenuItem>
            <MenuItem key="delete-comment">
				<div onClick={handleDeleteComment}>
					<Grid container spacing={1} alignItems="flex-start">
						<Grid item>
							<DeleteForever />
						</Grid>
						<Grid item>Delete</Grid>
					</Grid>
				</div>
			</MenuItem>
		</Menu>
	);
};

export default OptionsMenu