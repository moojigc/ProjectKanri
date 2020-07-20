import React from "react";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, List, ListItemText, Drawer, ListItem, Divider, useMediaQuery, useTheme, ListItemIcon, Tooltip } from "@material-ui/core";
import { DeveloperBoard } from "@material-ui/icons";

const drawerWidth = 240;
const miniWidth = 60;

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		zIndex: theme.zIndex.drawer,
		opacity: 0.9
	},
	drawerPaper: {
		width: drawerWidth
	},
	drawerContainer: {
		overflow: "auto"
	},
	minidrawer: {
		width: miniWidth,
		flexShrink: 0,
		zIndex: theme.zIndex.drawer
	},
	miniPaper: {
		width: miniWidth
	}
}));

// <Tooltip title="Project Home" aria-label="Go to project home" placement="right">
// 	<DeveloperBoard color="textPrimary"></DeveloperBoard>
// </Tooltip>;

const ProjectNav = ({ projectId, title }) => {
	const classes = useStyles();

	const theme = useTheme();
	const mdBreak = useMediaQuery(theme.breakpoints.up("md"));

	return (
		<React.Fragment>
			{mdBreak ? (
				<Drawer
					className={clsx(classes.drawer)}
					variant="permanent"
					classes={{
						paper: classes.drawerPaper
					}}
				>
					<Toolbar />
					<div className={clsx(classes.drawerContainer)}>
						<List>
							<ListItem button component={RouterLink} to={`/project/${projectId}`} key={"projecthome"}>
								<ListItemIcon>
									<DeveloperBoard></DeveloperBoard>
								</ListItemIcon>
								<ListItemText primary={title ? title : "Project Home"}></ListItemText>
							</ListItem>
							<Divider />
						</List>
					</div>
				</Drawer>
			) : (
				<Drawer
					className={clsx(classes.minidrawer)}
					variant="permanent"
					classes={{
						paper: classes.miniPaper
					}}
				>
					<Toolbar />
					<div className={clsx(classes.drawerContainer)}>
						<List>
							<ListItem button component={RouterLink} to={`/project/${projectId}`} key={"projecthome"}>
								<Tooltip arrow title={title ? title : "Project Home"} aria-label="Go to project home" placement="right">
									<DeveloperBoard color="textPrimary"></DeveloperBoard>
								</Tooltip>
							</ListItem>
							<Divider />
						</List>
					</div>
				</Drawer>
			)}
		</React.Fragment>
	);
};

export default ProjectNav;
