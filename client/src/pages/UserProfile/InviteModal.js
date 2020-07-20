import React, { useState, useRef, useEffect } from "react";
import ModalForm from "../../components/ModalForm";
import inviteAPI from "../../utils/inviteAPI";
import { TextField, Switch, FormControlLabel, Grid } from "@material-ui/core";
import { emailRegex } from "../../utils/shared";
import { Alert } from "@material-ui/lab";

const InviteModal = ({ projectId, userIsAdmin, openInvite, setInviteOpen }) => {
	const [flash, setFlash] = useState({ message: null, type: null });
	const [invalid, setInvalid] = useState(true);
	const [userResults, setUserResults] = useState([
		{
			username: ""
		}
	]);
	const [admin, setAdmin] = useState(false);
	const input = useRef(null);
	const handleSearch = async (query) => {
		const results = await inviteAPI.searchUsers(query);
		setUserResults(results);
	};
	const handleInvite = async (event) => {
		event.preventDefault();
		const { value } = input.current;
		if (/\s/.test(value.trim())) {
			setFlash({ message: "Not a valid username or email.", type: "error" });
			return;
		}
		let res = await inviteAPI.sendInvite(projectId, admin, { [emailRegex.test(value) ? "email" : "username"]: value });
		setFlash(res.flash);
		console.log(res);
	};
	useEffect(() => {
		setInvalid(flash.type === "error");
	}, [flash.type]);
	return (
		<ModalForm
			onFormSubmit={handleInvite}
			flash={flash}
			open={openInvite}
			setOpen={setInviteOpen}
			information="Enter invitee's username or email address and they will receive an invite to join your project."
			BoxStyle={{ minWidth: "max-content", width: "50%" }}
			TextFields={[
				<TextField
					error={invalid}
					onBlur={() => setInvalid(false)}
					helperText={invalid ? flash.message : ""}
					inputRef={input}
					color="secondary"
					name="email_or_username"
					fullWidth
					label="Enter invitee's username or password."
					type="text"
				/>,
				<React.Fragment>
					{userIsAdmin ? (
						<Grid container justify="center">
							<FormControlLabel
								label="Make invitee an admin?"
								control={
									<Switch color="secondary" checked={admin} onChange={({ target }) => setAdmin(target.checked)} name="admin" />
								}
							/>
						</Grid>
					) : null}
				</React.Fragment>
			]}
		/>
	);
};

export default InviteModal;
