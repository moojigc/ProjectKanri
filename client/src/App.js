import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider as UserProvider } from "./utils/UserContext";
import { Provider as FlashProvider } from "./utils/FlashContext";
import Login from "./pages/Login";
import userAPI from "./utils/userAPI";
import Task from "./pages/Task";
import Register from "./pages/Register";
import theme from "./utils/theme";
import { ThemeProvider, useMediaQuery, CssBaseline } from "@material-ui/core";
import Navbar from "./components/Navbar";
import "./App.scss";
import Welcome from "./pages/Welcome";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Project from "./pages/Project";
import sakuraBranch from "./sakura_branch.png";
import sakuraFlipped from "./sakura_flipped.png";

function App() {
	const browserDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const getUserDarkMode = (browserDarkMode) => {
		const storedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
		if (storedDarkMode !== undefined) return storedDarkMode;
		else return browserDarkMode;
	};
	const userPrefersDarkMode = getUserDarkMode(browserDarkMode);
	const forceLightTheme = theme(false);

	const [preferredTheme, setPreferredTheme] = useState(browserDarkMode);
	const [isMounted, setMounted] = useState(false);
	const [user, setUser] = useState({
		auth: false,
		username: "Guest",
		_id: ""
	});
	const [flash, setFlash] = useState({
		message: "",
		type: "error" || "success"
	});

	useEffect(() => {
		setPreferredTheme(userPrefersDarkMode);
		userAPI.checkStatus().then((res) => {
			setUser(res.user);
			setMounted(true);
		});
	}, [userPrefersDarkMode]);
	return (
		<Router>
			<UserProvider value={{ user, setUser }}>
				<FlashProvider value={{ flash, setFlash }}>
					<ThemeProvider theme={theme(preferredTheme)}>
						<CssBaseline />
						<img
							src={sakuraFlipped}
							style={{
								zIndex: -1,
								position: "fixed",
								width: "15rem",
								top: "2rem",
								left: 0
							}}
						/>
						<img
							src={sakuraBranch}
							style={{
								zIndex: -1,
								position: "fixed",
								width: "15rem",
								right: 0,
								bottom: 0
							}}
						/>
						<Navbar
							setPreferredTheme={setPreferredTheme}
							preferredTheme={preferredTheme}
						/>
						<Switch>
							<Route exact path={["/", "/dashboard"]}>
								{isMounted ? (
									user.auth ? (
										<Dashboard />
									) : (
										<Redirect to="/welcome" />
									)
								) : null}
							</Route>
							<Route exact path="/welcome">
								<ThemeProvider theme={forceLightTheme}>
									<Welcome />
								</ThemeProvider>
							</Route>
							<Route exact path="/login">
								<Login />
							</Route>
							<Route exact path="/resetpass/:token">
								<ResetPassword />
							</Route>
							<Route exact path="/task/:id">
								<Task />
							</Route>
							<Route exact path="/signup">
								<Register />
							</Route>
							<Route exact path="/task">
								<Task />
							</Route>
							<Route exact path="/profile">
								{isMounted ? (
									user.auth ? (
										<UserProfile />
									) : (
										<Redirect to="/login" />
									)
								) : null}
							</Route>
							<Route exact path="/project/:id">
								<Project />
							</Route>
						</Switch>
					</ThemeProvider>
				</FlashProvider>
			</UserProvider>
		</Router>
	);
}

export default App;
