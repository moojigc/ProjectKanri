import React, { useState, useContext, useRef, useEffect } from "react";
import ModalForm from "../../components/ModalForm";
import inviteAPI from "../../utils/inviteAPI";
import { TextField, Switch, FormControlLabel } from "@material-ui/core";
import { emailRegex } from "../../utils/shared";

const InviteModal = ({ projectId, openInvite, setInviteOpen }) => {
	const [flash, setFlash] = useState({ message: null, type: null });
	const [admin, setAdmin] = useState(false);
	const input = useRef(null);
	const handleInvite = async (event) => {
		event.preventDefault();
		const { value } = input.current;
		console.log(value);
		console.log(projectId);
		let key = emailRegex.test(value) ? "email" : "username";
		console.log(key);
		let body = {
			[key]: value
		};
		console.log(body);
		let res = await inviteAPI.sendInvite(projectId, admin, { [key]: value });
		console.log(res);
		setFlash(res.flash);
	};
	useEffect(() => {
		return () => setFlash({ message: null, type: null });
	}, []);
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
					inputRef={input}
					color="secondary"
					name="email_or_username"
					fullWidth
					label="Enter invitee's username or password."
					type="text"
				/>,
				<FormControlLabel
					label="Make invitee an admin?"
					control={<Switch checked={admin} onChange={({ target }) => setAdmin(target.value)} name="admin" />}
				/>
			]}
		/>
	);
};

export default InviteModal;
