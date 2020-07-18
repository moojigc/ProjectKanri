import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Link as A, useHistory, useLocation } from "react-router-dom";
import {
	Menu,
	MenuItem,
	makeStyles,
	List,
	ListItemText,
	Drawer,
	ListItemIcon,
	ListItem,
	Link,
	Switch,
	FormControlLabel,
	FormGroup,
	Grid
} from "@material-ui/core";
import { ExitToApp, HomeOutlined, Home, DashboardOutlined } from "@material-ui/icons";
import { UserContext } from "../../utils/UserContext";
import { FlashContext } from "../../utils/FlashContext";
import userAPI from "../../utils/userAPI";

const useStyles = makeStyles((theme) => ({
	nav: {
		background: theme.palette.background.paper
	},
	drawer: {
		background: theme.palette.background.default,
		padding: "1rem",
		height: "inherit",
		"& *": {
			color: theme.palette.primary.contrastText
		}
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		position: "relative"
	},
	paper: {
		background: theme.palette.background.default
	},
	homeIcon: {
		color: theme.palette.primary.contrastText
	}
}));
const Navbar = ({ preferredTheme, setPreferredTheme }) => {
	const [navTitle, setNavTitle] = useState("ProjectKanri");
	const [anchorEl, setAnchorEl] = useState(false);
	const open = Boolean(anchorEl);
	const { user, setUser } = useContext(UserContext);
	const { setFlash } = useContext(FlashContext);
	const location = useLocation();
	const history = useHistory();
	const classes = useStyles();
	const [drawerOpen, setDrawerOpen] = useState(false);
	// const toggleDrawer = (event) => {
	// 	if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
	// 		return;
	// 	}
	// 	setDrawerOpen(!drawerOpen);
	// };
	const logout = async () => {
		let res = await userAPI.logout();
		setUser(res.user);
		setFlash(res.flash);
		history.push("/login");
	};
	const handleChangeTheme = ({ target }) => {
		setPreferredTheme(target.checked);
		localStorage.setItem("darkMode", target.checked);
	};
	useEffect(() => {
		let title = location.pathname.split("/")[1];
		let formattedTitle =
			location.pathname !== "/"
				? title.charAt(0).toUpperCase() + title.substring(1) + " - ProjectKanri"
				: "ProjectKanri";
		document.title = formattedTitle;
		setNavTitle(formattedTitle);
	}, [location.pathname]);
	// const AppDrawer = () => {
	// 	return (
	// 		<Drawer
	// 			variant="temporary"
	// 			transitionDuration={400}
	// 			anchor="left"
	// 			open={drawerOpen}
	// 			onClose={toggleDrawer}>
	// 			<div className={classes.drawer}>
	// 				<List>
	// 					<ListItem button component={A} to="/dashboard" key="/dashboard">
	// 						<ListItemIcon>
	// 							<DashboardOutlined />
	// 						</ListItemIcon>
	// 						<ListItemText>Dashboard</ListItemText>
	// 					</ListItem>
	// 					{user?.auth ? (
	// 						<ListItem button key="logout" onClick={logout}>
	// 							<ListItemIcon>
	// 								<ExitToApp />
	// 							</ListItemIcon>
	// 							<ListItemText>Log Out</ListItemText>
	// 						</ListItem>
	// 					) : null}
	// 				</List>
	// 			</div>
	// 		</Drawer>
	// 	);
	// };
	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return location.pathname === "/welcome" ? null : (
		<div>
			{/* <AppDrawer /> */}
			<AppBar className={clsx(classes.nav,classes.appBar)} position="static">
				<Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
					<A to={"/dashboard"}>
						<IconButton edge="start" color="inherit" aria-label="Go Home">
							<HomeOutlined className={clsx(classes.homeIcon)} />
						</IconButton>
					</A>
					<Typography variant="h6">{navTitle}</Typography>
					{!user.auth ? (
						<Button color="inherit">
							<Link color="textPrimary" component={A} to="/login">
								Login
							</Link>
						</Button>
					) : (
						<div>
							<IconButton
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleMenu}
								color="inherit">
								<AccountCircle />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								PaperProps={{ className: classes.paper }}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right"
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right"
								}}
								open={open}
								onClose={handleClose}>
								<MenuItem component={A} to="/dashboard">
									Dashboard
								</MenuItem>
								<MenuItem component={A} to="/profile">
									Profile
								</MenuItem>
								<MenuItem>
									<FormGroup row>
										<FormControlLabel
											control={
												<Switch
													checked={preferredTheme}
													onChange={handleChangeTheme}
												/>
											}
											label="Dark Mode"
										/>
									</FormGroup>
								</MenuItem>
								<MenuItem>
									<div onClick={logout}>
										<Grid container spacing={1} alignItems="flex-start">
											<Grid item>Logout</Grid>
											<Grid item>
												<ExitToApp />
											</Grid>
										</Grid>
									</div>
								</MenuItem>
							</Menu>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default Navbar;
