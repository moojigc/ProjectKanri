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
import { AvatarGroup } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ButtonLink } from "../../components/MiniComponents";

import moment from "moment";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
		backgroundColor: theme.palette.kone.light
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
	avgroupLabel: {
		border: "none",
		paddingRight: ".5rem",
		marginRight: ".2rem"
	},
	avgroup: {
		marginBottom: ".5rem"
	},
	avatar: {
		// border: "none",
		backgroundColor: theme.palette.secondary.main,
		borderColor: theme.palette.secondary.light
	},
	viewColor: { 
		backgroundColor: theme.palette.primary.main,
		padding: ".5rem",
		boxShadow: theme.shadows[1]
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

	let adminNames = admins.map((admin) => admin.username);
	let memberNames = members.map((member) => member.username);

	return (
		<Card className={clsx(classes.root)}>
			<CardHeader title={title} subheader={moment(updatedAt).format("D-MMM-YYYY")} />
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					{description}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<ButtonLink size="small" to={`/project/${id}`} className={classes.viewColor}>
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
					<AvatarGroup max={4} className={clsx(classes.avgroup)}>
						<Typography component="span" className={clsx(classes.avgroupLabel)}>
							Admins:
						</Typography>
						{admins
							? adminNames.map((admin) => {
									return (
										<Tooltip arrow title={admin} key={admin}>
											<Avatar
												style={{fontSize: "1rem" }}
												className={classes.avatar}
												alt={admin}>
												{admin.charAt(0).toUpperCase()}
											</Avatar>
										</Tooltip>
									);
							  })
							: ""}
					</AvatarGroup>
					{/* <Typography paragraph>{admins ? adminNames.join(", ") : ""}</Typography> */}
					<AvatarGroup max={7} className={clsx(classes.avgroup)}>
						<Typography component="span" className={clsx(classes.avgroupLabel)}>
							Members:
						</Typography>
						{members
							? memberNames.map((mem) => {
									return (
										<Tooltip arrow title={mem} key={mem}>
											<Avatar
												style={{fontSize: "1rem" }}
												className={classes.avatar}
												alt={mem}>
												{mem.charAt(0).toUpperCase()}
											</Avatar>
										</Tooltip>
									);
							  })
							: ""}
					</AvatarGroup>
					{/* <Typography paragraph>{members ? memberNames.join(", ") : ""}</Typography> */}
					<AvatarGroup max={1} className={clsx(classes.avgroup)}>
						<Typography component="span" className={clsx(classes.avgroupLabel)}>
							Created By:
						</Typography>
						<Tooltip arrow title={creator}>
							<Avatar
								className={classes.avatar}
								style={{ marginRight: "1rem", fontSize: "1rem" }}
								alt={creator}>
								{creator.charAt(0).toUpperCase()}
							</Avatar>
						</Tooltip>
					</AvatarGroup>
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default ProjectCard;
