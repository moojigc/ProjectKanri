import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { UserProvider } from './utils/UserContext'
import UserStatus from "./components/UserStatus";
import Login from "./pages/Login";
import { getUserStatus } from "./utils/userAPI";
import "./App.scss";

function App() {
	return (
		<Router>
			<UserProvider>
				<UserStatus>
					<Switch>
						<Route exact path="/login">
							<Login />
						</Route>
					</Switch>
				</UserStatus>
			</UserProvider>
		</Router>
	);
}

export default App;
