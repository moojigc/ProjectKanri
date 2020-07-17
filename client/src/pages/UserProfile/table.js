import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	table: {
		background: theme.palette.secondary.light,
		width: "100%",
		"& *:not(button)": {
			color: theme.palette.getContrastText(theme.palette.secondary.light)
		}
	}
}));

export default function UserDetailTable({ data = [], label }) {
	const classes = useStyles();
	const [editableData, setEditableData] = useState(
		data.map((d) => {
			return {
				...d,
				editMode: false
			};
		})
	);

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label={label}>
				<TableBody>
					{data.map((d) => (
						<TableRow key={d.key}>
							<TableCell component="th" scope="row">
								{d.key}
							</TableCell>
							<TableCell align="right">
								{d.editable && d.editMode ? (
									<form onSubmit={(event) => event.preventDefault()}>
										<TextField label={d.key} placeholder={d.value} />
									</form>
								) : (
									d.value
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
