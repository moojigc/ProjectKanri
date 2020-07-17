import React, { useState, useCallback, useRef } from "react";
import { makeStyles, Divider } from "@material-ui/core";
import { ItemTypes } from "../../utils/actions";
import { Grid, Typography } from "@material-ui/core/";
import clsx from "clsx";

import { DndProvider, useDrag, useDrop } from "react-dnd";

const useStyles = makeStyles((theme) => ({
	taskOutline: {
		border: "1px gray",
		boxShadow: "1px 2px 2px 1px rgba(97, 108, 153, .3)",
		marginBottom: "1rem"
		// padding: theme.spacing(2)
	},
	colBorder: {
		paddingLeft: ".5rem",
        borderLeft: "1px dotted gray",
        borderRight:  "1px dotted gray"
	}
}));

const KanbanCol = ({ status, changeTaskStatus, children }) => {
	const classes = useStyles();

	const ref = useRef(null);
	const [, drop] = useDrop({
		accept: ItemTypes.DTASK,
		drop(item) {
			changeTaskStatus(item.id, status);
		}
	});
	drop(ref);

	return (
		<Grid item xs={12} sm={6} md={3} ref={ref} className={clsx(classes.colBorder)}>
			{children}
		</Grid>
	);
};

export default KanbanCol;
