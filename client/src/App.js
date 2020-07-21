import React, { useState, useEffect } from "react";
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
import AcceptInvite from "./pages/AcceptInvite";
import NoMatch from "./pages/NoMatch";

function App() {
	const browserLightMode = useMediaQuery("(prefers-color-scheme: light)");
	const getUserLightMode = (browserLightMode) => {
		const storedLightMode = JSON.parse(localStorage.getItem("lightMode"));
		if (storedLightMode !== undefined) return storedLightMode;
		else return browserLightMode;
	};
	const userPrefersLightMode = getUserLightMode(browserLightMode);
	const forceLightTheme = theme(true);

	const [preferredTheme, setPreferredTheme] = useState(browserLightMode);
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
		setPreferredTheme(userPrefersLightMode);
		userAPI.checkStatus().then((res) => {
			setUser(res.user);
			setMounted(true);
		});
	}, [userPrefersLightMode]);
	return (
		<Router>
			<UserProvider value={{ user, setUser }}>
				<FlashProvider value={{ flash, setFlash }}>
					<ThemeProvider theme={theme(preferredTheme)}>
						<CssBaseline />
						<img
							src={sakuraFlipped}
							alt="sakura branch"
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
							alt="sakura branch"
							style={{
								zIndex: -1,
								position: "fixed",
								width: "15rem",
								right: 0,
								bottom: 0
							}}
						/>
						<div style={{ marginBottom: "4rem" }}>
							<Navbar setPreferredTheme={setPreferredTheme} preferredTheme={preferredTheme} />
						</div>
						<Switch>
							<Route exact path={["/", "/dashboard"]}>
								{isMounted ? user.auth ? <Dashboard /> : <Redirect to="/welcome" /> : null}
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
							<Route exact path="/project/:projectId/task/:id">
								<Task />
							</Route>
							<Route exact path="/signup">
								<Register />
							</Route>
							<Route exact path="/profile">
								{isMounted ? user.auth ? <UserProfile /> : <Redirect to="/login" /> : null}
							</Route>
							<Route exact path="/project/:id">
								<Project />
							</Route>
							<Route exact path="/accept-invite/:token">
								<AcceptInvite />
							</Route>
							<Route path="*">
								<NoMatch />
							</Route>
						</Switch>
					</ThemeProvider>
				</FlashProvider>
			</UserProvider>
		</Router>
	);
}

export default App;
