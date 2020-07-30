import React, { useState } from "react";
import ModalForm from "../../components/ModalForm";
import userAPI from "../../utils/userAPI";
import { TextField } from "@material-ui/core";

const UpdatePassword = ({ open, setOpen }) => {
	const [flash, setFlash] = useState({ message: null, type: null });
	const [passwords, setPasswords] = useState({
		current: "",
		password: "",
		password2: ""
	});
	const handleChange = ({ target }) => {
		let { name, value } = target;
		setPasswords({
			...passwords,
			[name]: value
		});
	};
	const handleUpdatePass = async (event) => {
		event.preventDefault();
		let res = await userAPI.updatePasswordWithCurrent(
			passwords.current,
			passwords.password,
			passwords.password2
		);
		setFlash(res.flash);
	};
	return (
		<ModalForm
			onFormSubmit={handleUpdatePass}
			flash={flash}
			open={open}
			setOpen={setOpen}
			information="Enter your current password in order to set a new one."
			BoxStyle={{ minWidth: "max-content", width: "50%" }}
			TextFields={[
				<TextField
					color="secondary"
					name="current"
					onChange={handleChange}
					fullWidth
					label="Current Password"
					type="password"
				/>,
				<TextField
					color="secondary"
					name="password"
					onChange={handleChange}
					fullWidth
					label="New Password"
					type="password"
				/>,
				<TextField
					color="secondary"
					name="password2"
					onChange={handleChange}
					fullWidth
					label="Confirm new password"
					type="password"
				/>
			]}
		/>
	);
};

export default UpdatePassword;
