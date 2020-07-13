import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider as UserProvider } from "./utils/UserContext";
import { Provider as FlashProvider } from "./utils/FlashContext";
import Login from "./pages/Login";
import userAPI from "./utils/userAPI";
import Task from "./pages/Task";
import Register from "./pages/Register";
import theme from "./utils/theme";
import { ThemeProvider, CircularProgress, Container } from "@material-ui/core";
import Navbar from "./components/Navbar";
import "./App.scss";
import Welcome from "./pages/Welcome";
import UserProfile from "./pages/UserProfile";
import { Wrapper } from "./components/MiniComponents";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";

function App() {
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
		userAPI.checkStatus().then((res) => {
			setUser(res.user);
			setMounted(true);
		});
	}, []);
	return (
		<Router>
			<UserProvider value={{ user, setUser }}>
				<FlashProvider value={{ flash, setFlash }}>
					<ThemeProvider theme={theme}>
						<Navbar />
						<Switch>
							<Route exact path="/">
								{isMounted ? (
									user.auth ? (
										<UserProfile />
									) : (
										<Redirect to="/welcome" />
									)
								) : // Temporary fix, page loads before user session from server loads
								null}
							</Route>
							<Route exact path="/welcome">
								<Welcome />
							</Route>
							<Route exact path="/login">
								<Login />
							</Route>
							<Route exact path="/task">
								<Task />
							</Route>
							<Route exact path="/task/:id">
								<Task />
							</Route>
							<Route exact path="/signup">
								<Register />
							</Route>
							<Route exact path="/myprofile">
								{isMounted ? (
									user.auth ? (
										<UserProfile />
									) : (
										<Redirect to="/login" />
									)
								) : null}
							</Route>
							<Route exact path="/dashboard">
								<Dashboard />
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
