import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
// import { Wrapper } from "../../components/MiniComponents";
import { Title, Wrapper, ButtonLink } from "../../components/MiniComponents";
import Container from "@material-ui/core/Container";
import { Grid, Card, CardContent, Typography, CardHeader } from "@material-ui/core/";
import projectAPI from "../../utils/projectAPI";

const useStyles = makeStyles((theme) => ({
	dynamicgrid: {
		flexGrow: 1,
		padding: theme.spacing(2)
	}
}));

const Project = () => {
    const classes = useStyles();
    const [project, setProject] = useState({});
    const { id } = useParams();

    useEffect(() => {
        //
    },[]);

    return (

        <Container>
            <Wrapper>
                <Typography paragraph>Under Construction</Typography>
            </Wrapper>
        </Container>
    );
}

export default Project;