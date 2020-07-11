import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ButtonLink } from "../../components/MiniComponents";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345
	},
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: "rotate(180deg)"
	},
	avatar: {
		backgroundColor: blue[500]
	}
}));

const ProjectCard = ({
	id,
	title,
	description,
	createdAt,
	updatedAt,
	// tasks,
	admins,
	members,
	creator,
	children,
	...props 
}) => {
	const classes = useStyles();
	const [projectID, setProjectID] = useState(id);
	const [expanded, setExpanded] = useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	let admninNames = admins.map((admin) => admin.username);
	let memberNames = members.map((member) => member.username);

	return (
		<Card className={classes.root}>
			<CardHeader title={title} subheader={moment(updatedAt).format("D-MMM-YYYY")} />
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					{description}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<ButtonLink size="small" to={`/project/${id}`} color="secondary">
					View Project
				</ButtonLink>
				<IconButton
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded
					})}
					onClick={handleExpandClick}
					aria-expanded={expanded}
					aria-label="show more">
					<ExpandMoreIcon />
				</IconButton>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<Typography paragraph>Admins:</Typography>
					<Typography paragraph>{admins ? admninNames.join(", ") : ""}</Typography>
					<Typography paragraph>Members:</Typography>
					<Typography paragraph>{members ? memberNames.join(", ") : ""}</Typography>
					<Typography paragraph>Created By: {creator}</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default ProjectCard;
