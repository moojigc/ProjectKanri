import React, { useState, useEffect, useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Link as A, useHistory, useLocation } from "react-router-dom";
import {
	makeStyles,
	List,
	ListItemText,
	Drawer,
	ListItemIcon,
	ListItem,
	Link
} from "@material-ui/core";
import { ExitToApp, HomeOutlined } from "@material-ui/icons";
import { UserContext } from "../../utils/UserContext";
import { FlashContext } from "../../utils/FlashContext";
import userAPI from "../../utils/userAPI";

const useStyles = makeStyles((theme) => ({
	nav: {
		background: theme.palette.primary.light
	},
	drawer: {
		background: theme.palette.primary.light,
		padding: "1rem",
		height: "inherit"
	}
}));

const Navbar = () => {
	const [anchorEl, setAnchorEl] = useState(false);
	const open = Boolean(anchorEl);
	const { user, setUser } = useContext(UserContext);
	const { setFlash } = useContext(FlashContext);
	const location = useLocation();
	const history = useHistory();
	const classes = useStyles();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const toggleDrawer = (event) => {
		if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
			return;
		}
		setDrawerOpen(!drawerOpen);
	};
	const logout = async () => {
		let res = await userAPI.logout();
		setUser(res.user);
		setFlash(res.flash);
		history.push("/login");
	};
	useEffect(() => {
		let title = location.pathname.split("/")[1];
		document.title =
			location.pathname !== "/" || location.pathname !== "/welcome"
				? title.charAt(0).toUpperCase() + title.substring(1) + " - ProjectKanri"
				: "ProjectKanri";
	}, [location.pathname]);
	const handleChange = (event) => {
		setAuth(event.target.checked);
	};
	const AppDrawer = () => {
		return (
			<Drawer
				variant="temporary"
				transitionDuration={400}
				anchor="left"
				open={drawerOpen}
				onClose={toggleDrawer}>
				<div className={classes.drawer}>
					<List>
						<ListItem button component={A} to="/" key="/">
							<ListItemIcon>
								<HomeOutlined />
							</ListItemIcon>
							<ListItemText>Home</ListItemText>
						</ListItem>
						{user?.auth ? (
							<ListItem button key="logout" onClick={logout}>
								<ListItemIcon>
									<ExitToApp />
								</ListItemIcon>
								<ListItemText>Log Out</ListItemText>
							</ListItem>
						) : null}
					</List>
				</div>
			</Drawer>
		);
	};
	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return location.pathname === "/welcome" ? null : (
		<div>
			<AppDrawer />
			<AppBar className={classes.nav} position="static">
				<Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
					<IconButton
						onClick={toggleDrawer}
						edge="start"
						color="inherit"
						aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6">ProjectKanri</Typography>
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
								<MenuItem onClick={handleClose}>Profile</MenuItem>
								<MenuItem onClick={handleClose}>My account</MenuItem>
							</Menu>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default Navbar;
