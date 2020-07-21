import React, { useState, useRef, useEffect } from "react";
import ModalForm from "../../components/ModalForm";
import inviteAPI from "../../utils/inviteAPI";
import {
	TextField,
	Switch,
	FormControlLabel,
	Grid,
	List,
	ListItem,
	Box,
	CircularProgress,
	Divider,
	Typography as T,
	Button
} from "@material-ui/core";
import { emailRegex } from "../../utils/shared";
import { Alert } from "@material-ui/lab";
import useDebounce from "../../utils/debounceHook";

const InviteModal = ({ projectId, userIsAdmin, openInvite, setInviteOpen }) => {
	const [flash, setFlash] = useState({ message: null, type: null });
	const [invalid, setInvalid] = useState(true);
	const [userResults, setUserResults] = useState([]);
	const [inProgress, setInProgress] = useState(false);
	const [admin, setAdmin] = useState(false);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);
	const handleInvite = async (id) => {
		let res = await inviteAPI.sendInvite(projectId, admin, id);
		setFlash(res.flash);
		console.log(res);
	};
	useEffect(() => {
		setInvalid(flash.type === "error");
	}, [flash.type]);
	useEffect(() => {
		if (search === "") {
			setUserResults([]);
			setInProgress(false);
			return;
		}
		if (debouncedSearch) {
			setInProgress(true);
			inviteAPI.searchUsers(search.trim()).then((results) => {
				setUserResults(results);
				setInProgress(false);
			});
		}
	}, [debouncedSearch]);
	return (
		<ModalForm
			onFormSubmit={(event) => event.preventDefault()}
			flash={flash}
			open={openInvite}
			setOpen={setInviteOpen}
			information="Enter invitee's username or email address and they will receive an invite to join your project."
			BoxStyle={{ minWidth: "max-content", maxWidth: "90vw" }}
			TextFields={[
				<TextField
					error={invalid}
					onChange={({ target }) => setSearch(target.value)}
					onBlur={() => setInvalid(false)}
					helperText={invalid ? flash.message : ""}
					// inputRef={input}
					color="secondary"
					name="email_or_username"
					fullWidth
					label="Search by username or password"
					type="text"
				/>,
				// <React.Fragment>
				// 	{userIsAdmin ? (
				// 		<Grid container justify="center">
				// 			<FormControlLabel
				// 				label="Make invitee an admin?"
				// 				control={
				// 					<Switch color="secondary" checked={admin} onChange={({ target }) => setAdmin(target.checked)} name="admin" />
				// 				}
				// 			/>
				// 		</Grid>
				// 	) : null}
				// </React.Fragment>,
				search !== "" && (
					<Box boxShadow={2} borderRadius="0.15rem" border="1px solid white" width="100%">
						<Grid container justify="center">
							<T variant="h4">Members found</T>
						</Grid>
						<Divider />
						<Grid container justify="center">
							{!inProgress ? (
								userResults.length ? (
									<List style={{ width: "inherit" }}>
										{userResults.map((r, i, arr) => (
											<React.Fragment key={r._id}>
												<ListItem key={r._id}>
													<Grid container alignItems="center" justify="space-between">
														<div>
															<T>{r.username}</T>
															<T variant="caption">
																{r.firstName} {r.lastName}
															</T>
														</div>
														<div>
															{userIsAdmin && (
																<FormControlLabel
																	label="Admin?"
																	control={
																		<Switch
																			color="secondary"
																			checked={admin}
																			onChange={({ target }) => setAdmin(target.checked)}
																			name="admin"
																		/>
																	}
																/>
															)}
															<Button variant="outlined" color="secondary" onClick={() => handleInvite(r._id)}>
																Invite
															</Button>
														</div>
													</Grid>
												</ListItem>
												{i !== arr.length - 1 && <Divider />}
											</React.Fragment>
										))}
									</List>
								) : (
									<T variant="h5">No results.</T>
								)
							) : (
								<Grid container justify="center">
									<CircularProgress
										style={{ margin: "1rem 0" }}
										aria-busy="true"
										aria-describedby="Loading results for users"
										size="2rem"
									/>
								</Grid>
							)}
						</Grid>
					</Box>
				)
			]}
		/>
	);
};

export default InviteModal;
