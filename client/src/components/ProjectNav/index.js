import React from "react";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, List, ListItemText, Drawer, ListItem, Divider } from "@material-ui/core";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		zIndex: theme.zIndex.drawer
	},
	drawerPaper: {
		width: drawerWidth
	},
	drawerContainer: {
		overflow: "auto"
	}
}));

const ProjectNav = ({ projectId, title }) => {
	const classes = useStyles();

	return (
		<Drawer
			className={clsx(classes.drawer)}
			variant="permanent"
			classes={{
				paper: classes.drawerPaper
			}}>
			<Toolbar />
			<div className={clsx(classes.drawerContainer)}>
				<List>
					<ListItem
						button
						component={RouterLink}
						to={`/project/${projectId}`}
						key={"projecthome"}>
						<ListItemText primary={title ? title : "Project Home"}></ListItemText>
					</ListItem>
					<Divider />
				</List>
			</div>
		</Drawer>
	);
};

export default ProjectNav;
