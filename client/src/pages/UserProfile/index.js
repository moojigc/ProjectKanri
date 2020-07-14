import React, { useEffect, useState, useContext } from "react";
import Container from "@material-ui/core/Container";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import Axios from "axios";
import { UserContext } from "../../utils/UserContext";
import {
	Typography,
	Accordion,
	AccordionSummary,
	makeStyles,
	AccordionDetails,
	Grid
} from "@material-ui/core";
import moment from "moment";
import { ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	accordion: {
		background: theme.palette.secondary.dark,
		color: theme.palette.secondary.contrastText
	}
}));

const UserProfile = () => {
	const classes = useStyles();
	const { user } = useContext(UserContext);
	const [userData, setUserData] = useState({
		_id: "",
		username: "",
		email: "",
		firstName: "",
		lastName: ""
	});
	const [projects, setProjects] = useState([]);
	useEffect(() => {
		Axios({ url: "/api/myprofile " }).then(({ data }) => {
			let [userDataFromServer] = data.adminProjects[0].admins.filter(
				(a) => a._id === user._id
			);
			console.log(data);
			setUserData(userDataFromServer);
			setProjects(data.adminProjects.concat(data.regularProjects));
		});
	}, []);
	return (
		<Container>
			<Wrapper boxShadow={2}>
				<Title>Hi, {userData.firstName + " " + userData.lastName}</Title>
				<Accordion className={classes.accordion}>
					<AccordionSummary
						aria-controls="panel1a-content"
						id="panel1a-header"
						expandIcon={<ExpandMore />}>
						Account Summary
					</AccordionSummary>
					<AccordionDetails>
						<Grid container>
							<Grid item xs={12}>
								<Typography>Email: {userData.email}</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography>
									Account created:{" "}
									{moment(userData.createdAt).format("YYYY/MM/DD")}
								</Typography>
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
				{projects.map((project, i) => {
					return (
						<Accordion className={classes.accordion}>
							<AccordionSummary
								aria-controls={`panel${i}-content`}
								id={`panel${i}-header`}
								expandIcon={<ExpandMore />}>
								<Typography>Project: {project.title}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>Tasks: {project.tasks.length}</Typography>
							</AccordionDetails>
						</Accordion>
					);
				})}
			</Wrapper>
		</Container>
	);
};

export default UserProfile;
