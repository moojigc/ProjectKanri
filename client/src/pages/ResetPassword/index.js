import React, { useRef, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Typography as T, Grid, TextField, Button, Container } from "@material-ui/core";
import { Wrapper, Title } from "../../components/MiniComponents";
import { FlashContext } from "../../utils/FlashContext";
import { Alert } from "@material-ui/lab";
import userAPI from "../../utils/userAPI";

const ResetPassword = () => {
	const history = useHistory()
	const { token } = useParams();
	const passwordEl = useRef(null);
	const password2El = useRef(null);
	const { flash, setFlash } = useContext(FlashContext);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const res = await userAPI.updatePassword(
			passwordEl.current.value,
			password2El.current.value,
			token
		);
		setFlash(res.flash);
		if (res.flash.type === "success") history.push("/login")
	};

	return (
		<Container maxWidth="sm" component="main">
			<Wrapper>
				<Title>Reset Your Password</Title>
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item container>
							<Grid item xs={12}>
								<TextField
									variant="filled"
									fullWidth
									inputRef={passwordEl}
									label="Enter new password"
									type="password"
									name="password"
								/>
							</Grid>
						</Grid>
						<Grid item container>
							<Grid item xs={12}>
								<TextField
									variant="filled"
									fullWidth
									inputRef={password2El}
									label="Confirm new password"
									type="password"
									name="password2"
								/>
							</Grid>
						</Grid>
						<Grid item container justify="center">
							<Grid item xs={3}>
								<Button
									fullWidth
									type="submit"
									variant="contained"
									color="secondary">
									Reset
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</form>
			</Wrapper>
			{flash.message ? <Alert severity={flash.type}>{flash.message}</Alert> : null}
		</Container>
	);
};

export default ResetPassword;
