import React from "react";
import { Title, Wrapper } from "../../components/MiniComponents";
import Container from "@material-ui/core/Container";
import { Grid, Typography } from "@material-ui/core/";
import fourOhFlower from "../../sakura_flipped.png";

const NoMatch = () => {
	return (
		<Container maxWidth="lg" component="main">
			<Wrapper>
				<Title>404 - Page Not Found!</Title>
				<Grid container>
					<Grid item md={6}>
						<img src={fourOhFlower} alt="sakure flower" style={{ maxWidth: "100%", height: "auto" }} />
					</Grid>
					<Grid item md={6} style={{ textAlign: "center" }}>
						<Typography variant="h4" component="p">
							<em>~ This is not the page you are looking for ~</em>
						</Typography>
						<br></br>
						<Typography paragraph>Please admire the pretty art while you are here!!</Typography>
						<Typography paragraph  variant="h5"  component="p">{`(◕‿◕✿)`}</Typography>
					</Grid>
				</Grid>
			</Wrapper>
		</Container>
	);
};

export default NoMatch;
