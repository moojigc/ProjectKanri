import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import Face from "@material-ui/icons/Face";
import Lock from "@material-ui/icons/Lock";
import Send from "@material-ui/icons/Send";
import userApi from "../../utils/userAPI";
import Wrapper from "../../components/Wrapper";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useUserContext } from "../../utils/UserContext";
import taskAPI from "../../utils/taskAPI";

export default function Task() {
  const [task, setTask] = useState({});
  const { id } = useParams();
  useEffect(() => {
    taskAPI
      .getTask(id)
      .then((res) => setTask(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container maxWidth="lg" component="main">
      <h1 className="heading">Task: Title</h1>
      <Wrapper>
        <Grid container justify="center" spacing={2}>
          <Grid item sm={12}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Grid>
        </Grid>
      </Wrapper>
      <Wrapper style={{ marginTop: "1rem" }}>
        <Grid item sm={12}>
          {" "}
          Assigned User, Created By:, Updated Date:{" "}
        </Grid>
      </Wrapper>
      <Wrapper style={{ marginTop: "1rem" }}>
        <Grid item sm={12}>
          Text 1
        </Grid>
      </Wrapper>
      <Wrapper style={{ marginTop: "1rem" }}>
        <Grid item sm={12}>
          Text 1
        </Grid>
      </Wrapper>
      <Wrapper style={{ marginTop: "1rem" }}>
        <Grid item sm={12}>
          Text 1
        </Grid>
      </Wrapper>
      <Wrapper style={{ marginTop: "1rem" }}>
        <Grid item sm={12}>
          Text 1
        </Grid>
      </Wrapper>
      <Wrapper style={{ marginTop: "1rem" }}>
        <Grid item sm={12}>
          Text 1
        </Grid>
      </Wrapper>
    </Container>
  );
}
