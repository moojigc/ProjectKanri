import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core";
// import { Wrapper } from "../../components/MiniComponents";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import Container from "@material-ui/core/Container";
import { Grid, Card, CardContent, Typography, CardHeader } from "@material-ui/core/";
import ProjectCard from "../../components/ProjectCard";
// import dashboardAPI from "../../utils/dashboardAPI";
import projectAPI from "../../utils/projectAPI";

const useStyles = makeStyles((theme) => ({
	dynamicgrid: {
		flexGrow: 1,
		padding: theme.spacing(2)
	}
}));

const Dashboard = () => {
	const classes = useStyles();
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		// dashboardAPI
		// 	.getProjects()
		// 	.then((res) => {
		// 		let newRes = res.concat(res)
		// 		setProjects(newRes);
		// 	})
		// 	.catch((err) => console.error(err));
		projectAPI
			.getAllProjects()
			.then((res) => {
				let newRes = res.concat(res)
				setProjects(newRes);
			})
			.catch((err) => console.error(err));
	}, []);


	return (
		<Container maxWidth="lg" component="main">
			<Wrapper>
				<Title>Projects</Title>
				<div className={classes.dynamicgrid}>
					<Grid
						container
						spacing={2}
						direction="row"
						justify="flex-start"
						alignItems="flex-start">
						{projects.length ? (
							projects.map((project) => {
								return (
									<Grid item xs={12} sm={6} md={4} key={project._id}>
										<ProjectCard
											key={project._id}
											id={project._id}
											title={project.title}
											description={project.description}
											createdAt={project.createdAt}
											updatedAt={project.updatedAt}
											creator={project.creator.username}
											admins = {project.admins}
											members = {project.members}
											></ProjectCard>
									</Grid>
								);
							})
						) : (
							<Grid item xs={12}>
								<Typography paragraph>
									No projects to display. Start one today!
								</Typography>
							</Grid>
						)}
					</Grid>
				</div>
			</Wrapper>
		</Container>
	);
};

export default Dashboard;
