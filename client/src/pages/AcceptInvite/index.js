import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Dashboard from "../Dashboard";
import ModalForm from "../../components/ModalForm";

const AcceptInvite = () => {
	const [open, setOpen] = useState(true);
	const { token } = useParams();
	const handleAccept = () => {};

	return (
		<React.Fragment>
			<ModalForm
				open={open}
				setOpen={setOpen}
				information="Accept new invite to project?"
				otherButtons={}
			/>
			<Dashboard />
		</React.Fragment>
	);
};
