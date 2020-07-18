import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import {
	makeStyles,
	List,
	ListItemText,
	Drawer,
	ListItemIcon,
	ListItem,
    Link,
    Divider 
} from "@material-ui/core";
import { WebAsset } from "@material-ui/icons";

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

{/* <RouterLink to={`/project/${projectId}`}>
	<ListItem button key={"projecthome"}>
		<ListItemIcon>
			<WebAsset></WebAsset>
		</ListItemIcon>
		<ListItemText primary={"Project Home"}></ListItemText>
	</ListItem>
</RouterLink>; */}

const ProjectNav = ({ projectId, title }) => {
	const location = useLocation();
	const history = useHistory();
	const classes = useStyles();
	const [drawerOpen, setDrawerOpen] = useState(false);

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
					<ListItem button component={RouterLink} to={`/project/${projectId}`} key={"projecthome"}>
						<ListItemText primary={title ? title : "Project Home"}></ListItemText>
					</ListItem>
                    <Divider />
				</List>
			</div>
		</Drawer>
	);
};

export default ProjectNav;
