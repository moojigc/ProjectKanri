import React, { useEffect, useState, useContext } from "react";
import Container from "@material-ui/core/Container";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import Axios from "axios";
import { UserContext } from "../../utils/UserContext";
import { Typography, Accordion, AccordionSummary, makeStyles, AccordionDetails, Grid, Button } from "@material-ui/core";
import moment from "moment";
import { ExpandMore, ArrowForwardRounded } from "@material-ui/icons";
import UserDetailTable from "./table";
import UpdatePassword from "./UpdatePassword";
import InviteModal from "../../components/InviteModal";
import userAPI from "../../utils/userAPI";

const useStyles = makeStyles((theme) => ({
	accordion: {
		background: theme.palette.secondary.dark,
		color: theme.palette.secondary.contrastText,
		width: "100%"
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
		lastName: "",
		admin: false
	});
	const [projects, setProjects] = useState([]);
	const [projectId, setProjectId] = useState("");
	const [isMounted, setMounted] = useState(false);
	const [openInvite, setInviteOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const handleOpenInvite = (projectId, admins = []) => {
		setProjectId(projectId);
		setUserData({
			...userData,
			admin: admins.includes(userData._id)
		});
		setInviteOpen(true);
	};
	useEffect(() => {
		userAPI.getProfile().then((data) => {
			setUserData(data.user);
			setProjects(data.projects);
			setMounted(true);
		});
	}, []);
	return (
		<Container maxWidth="md">
			<UpdatePassword open={open} setOpen={setOpen} />
			<InviteModal userIsAdmin={userData.admin} projectId={projectId} openInvite={openInvite} setInviteOpen={setInviteOpen} />
			<Wrapper>
				<Title>Hi, {isMounted ? userData.firstName + " " + userData.lastName : user.username}</Title>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
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
					<Grid item xs={12} md={6}>
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
					<Grid item container>
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
													<Button onClick={() => handleOpenInvite(p._id, p.admins)}>Invite new member</Button>
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
