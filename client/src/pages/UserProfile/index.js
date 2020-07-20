import React, { useEffect, useState, useContext } from "react";
import { Link as A } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import Axios from "axios";
import { UserContext } from "../../utils/UserContext";
import { Typography, Accordion, AccordionSummary, makeStyles, AccordionDetails, Grid, Button, Link } from "@material-ui/core";
import moment from "moment";
import { ExpandMore, ArrowForwardRounded } from "@material-ui/icons";
import UserDetailTable from "./table";
import UpdatePassword from "./UpdatePassword";
import InviteModal from "./InviteModal";

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
	const [projectId, setProjectId] = useState("");
	const [isMounted, setMounted] = useState(false);
	const [openInvite, setInviteOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const handleOpenInvite = (projectId) => {
		setProjectId(projectId);
		setInviteOpen(true);
	};
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
			<UpdatePassword open={open} setOpen={setOpen} />
			<InviteModal projectId={projectId} openInvite={openInvite} setInviteOpen={setInviteOpen} />
			<Wrapper boxShadow={2}>
				<Title>Hi, {isMounted ? userData.firstName + " " + userData.lastName : user.username}</Title>
				<Grid container spacing={2}>
					<Grid item lg={6}>
						<Accordion className={classes.accordion}>
							<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMore />}>
								Your Personal Details
							</AccordionSummary>
							<AccordionDetails>
								<UserDetailTable
									data={[
										{
											key: "First Name",
											value: userData.firstName,
											editable: true
										},
										{
											key: "Last Name",
											value: userData.lastName,
											editable: true
										},
										{
											key: "Date joined",
											value: moment(userData.createdAt).format("MMMM Do, YYYY")
										}
									]}
									label="personal details"
								/>
							</AccordionDetails>
						</Accordion>
					</Grid>
					<Grid item lg={6}>
						<Accordion className={classes.accordion}>
							<AccordionSummary aria-controls="panel2a-content" id="panel2a-header" expandIcon={<ExpandMore />}>
								Your Account Details
							</AccordionSummary>
							<AccordionDetails>
								<UserDetailTable
									data={[
										{ key: "Username", value: userData.username },
										{
											key: "Email",
											value: userData.email,
											editable: true
										},
										{
											key: "Verified",
											value: userData.verified ? "Yes" : "No"
										},
										{
											key: "Password",
											value: (
												<Button onClick={() => setOpen(!open)} color="secondary" variant="contained" size="small">
													<Typography color="textPrimary">Change password</Typography>
												</Button>
											)
										}
									]}
									label="account-details"
								/>
							</AccordionDetails>
						</Accordion>
					</Grid>
					<Grid item lg={12}>
						<Accordion className={classes.accordion}>
							<AccordionSummary aria-controls="panel3a-content" id="panel3a-header" expandIcon={<ExpandMore />}>
								Your Projects
							</AccordionSummary>
							<AccordionDetails>
								<UserDetailTable
									data={projects.map((p, idx) => {
										return {
											key: `${idx + 1}. ${p.title}`,
											value: (
												<React.Fragment>
													<Button onClick={() => handleOpenInvite(p._id)}>Invite new member</Button>
													<ButtonLink
														variant="contained"
														color="secondary"
														to={"/project/" + p._id}
														endIcon={<ArrowForwardRounded />}
													>
														{p.tasks.length} Tasks
													</ButtonLink>
												</React.Fragment>
											)
										};
									})}
									label="projects"
								/>
							</AccordionDetails>
						</Accordion>
					</Grid>
				</Grid>
			</Wrapper>
		</Container>
	);
};

export default UserProfile;
