import React, { useEffect, useState, useContext } from "react";
import { Link as A } from "react-router-dom";
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
	Grid,
	Button,
	Link
} from "@material-ui/core";
import moment from "moment";
import { ExpandMore, ArrowForwardRounded } from "@material-ui/icons";
import UserDetailTable from "./table";

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
	const [isMounted, setMounted] = useState(false);
	useEffect(() => {
		Axios({ url: "/api/myprofile" }).then(({ data }) => {
			setUserData(data.user);
			setProjects(data.projects);
			setMounted(true);
			console.log(data);
		});
	}, []);
	return (
		<Container maxWidth="md">
			<Wrapper boxShadow={2}>
				<Title>
					Hi, {isMounted ? userData.firstName + " " + userData.lastName : user.username}
				</Title>
				<Accordion className={classes.accordion}>
					<AccordionSummary
						aria-controls="panel1a-content"
						id="panel1a-header"
						expandIcon={<ExpandMore />}>
						Your Personal Details
					</AccordionSummary>
					<AccordionDetails>
						<UserDetailTable
							data={[
								{
									key: "First Name",
									value: userData.firstName
								},
								{
									key: "Last Name",
									value: userData.lastName
								},
								{
									key: "Date joined",
									value: moment(userData.createdAt).format("MMMM Do, YYYY")
								}
							]}
						/>
					</AccordionDetails>
				</Accordion>
				<Accordion className={classes.accordion}>
					<AccordionSummary
						aria-controls="panel2a-content"
						id="panel2a-header"
						expandIcon={<ExpandMore />}>
						Your Account Details
					</AccordionSummary>
					<AccordionDetails>
						<UserDetailTable
							data={[
								{ key: "Username", value: userData.username },
								{
									key: "Email",
									value: userData.email
								},
								{
									key: "Verified",
									value: userData.verified ? "Yes" : "No"
								},
								{
									key: "Password",
									value: (
										<Button color="secondary" variant="contained" size="small">
											<Typography color="textPrimary">
												Change password
											</Typography>
										</Button>
									)
								}
							]}
						/>
					</AccordionDetails>
				</Accordion>
				<Accordion className={classes.accordion}>
					<AccordionSummary
						aria-controls="panel3a-content"
						id="panel3a-header"
						expandIcon={<ExpandMore />}>
						Your Projects
					</AccordionSummary>
					<AccordionDetails>
						<UserDetailTable
							data={projects.map((p, idx) => {
								return {
									key: `${idx + 1}. ${p.title}`,
									value: (
										<ButtonLink
											variant="contained"
											color="secondary"
											to={"/project/" + p._id}
											endIcon={<ArrowForwardRounded />}>
											{p.tasks.length} Tasks
										</ButtonLink>
									)
								};
							})}
						/>
					</AccordionDetails>
				</Accordion>
			</Wrapper>
		</Container>
	);
};

export default UserProfile;
