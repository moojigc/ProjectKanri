import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider as UserProvider } from "./utils/UserContext";
import { Provider as FlashProvider } from "./utils/FlashContext";
import Login from "./pages/Login";
import userAPI from "./utils/userAPI";
import Task from "./pages/Task";
import Register from "./pages/Register";
import theme from "./utils/theme";
import { ThemeProvider, useMediaQuery, CssBaseline, Grid, CircularProgress } from "@material-ui/core";
import Navbar from "./components/Navbar";
import "./App.scss";
import Welcome from "./pages/Welcome";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Project from "./pages/Project";
import AcceptInvite from "./pages/AcceptInvite";
import NoMatch from "./pages/NoMatch";
import { SakuraBranches } from "./components/MiniComponents";
import Footer from "./components/Footer";

function App() {
	const browserLightMode = useMediaQuery("(prefers-color-scheme: light)");
	const getUserLightMode = () => {
		const storedLightMode = JSON.parse(localStorage.getItem("lightMode"));
		return storedLightMode !== undefined ? storedLightMode : browserLightMode
	};
	const userPrefersLightMode = getUserLightMode()
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
	}, [userPrefersLightMode]);
	useEffect(() => {
		userAPI.checkStatus().then((res) => {
			setUser(res.user);
			console.log(res.user);
			setMounted(true);
		});
	}, []);
	return (
		<Router>
			<UserProvider value={{ user, setUser }}>
				<FlashProvider value={{ flash, setFlash }}>
					<ThemeProvider theme={theme(preferredTheme)}>
						<CssBaseline />
						<SakuraBranches />
						<Navbar setPreferredTheme={setPreferredTheme} preferredTheme={preferredTheme} />
						{isMounted ? (
							<Switch>
								<Route exact path={["/", "/dashboard"]}>
									{user.auth ? <Dashboard /> : <Redirect to="/welcome" />}
								</Route>
								<Route exact path="/welcome">
									<ThemeProvider theme={forceLightTheme}>
										<Welcome />
									</ThemeProvider>
								</Route>
								<Route exact path={["/login/:token", "/login"]}>
									<Login />
								</Route>
								<Route exact path="/resetpass/:token">
									<ResetPassword />
								</Route>
								<Route exact path="/project/:projectId/task/:id">
									{user.auth ? <Task /> : <Redirect to="/login" />}
								</Route>
								<Route exact path="/signup">
									<Register />
								</Route>
								<Route exact path="/profile">
									{user.auth ? <UserProfile /> : <Redirect to="/login" />}
								</Route>
								<Route exact path="/project/:id">
									{user.auth ? <Project /> : <Redirect to="/login" />}
								</Route>
								<Route exact path="/accept-invite/:token">
									<AcceptInvite user={user} setUser={setUser} />
								</Route>
								<Route path="*">
									<NoMatch />
								</Route>
							</Switch>
						) : (
							<Grid container justify="center" style={{ padding: "10rem 0" }}>
								<CircularProgress aria-describedby="loading page" aria-busy={!isMounted} size="10rem" />
							</Grid>
						)}
						{/* <Footer /> */}
					</ThemeProvider>
				</FlashProvider>
			</UserProvider>
		</Router>
	);
}

export default App;
