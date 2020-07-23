import React, { useState, useEffect } from "react";
import ModalForm from "../ModalForm";
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
	Button,
	useTheme,
	useMediaQuery
} from "@material-ui/core";
import useDebounce from "../../utils/debounceHook";

const InviteModal = ({ projectId, userIsAdmin, openInvite, setInviteOpen }) => {
	const [flash, setFlash] = useState({ message: null, type: null }),
		[invalid, setInvalid] = useState(true),
		[userResults, setUserResults] = useState([]),
		[inProgress, setInProgress] = useState(false),
		[search, setSearch] = useState(""),
		debouncedSearch = useDebounce(search, 500),
		isMobile = useMediaQuery("(max-width: 960px)"),
		theme = useTheme(),
		handleInvite = async (id, admin) => {
			let res = await inviteAPI.sendInvite(projectId, admin, id);
			setFlash(res.flash);
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
				setUserResults(
					results.map((r) => {
						return {
							...r,
							admin: false
						};
					})
				);
				setInProgress(false);
			});
		}
	}, [debouncedSearch]);

	const handleSetAdmin = (id, admin) => {
		setUserResults(
			userResults.map((r) => {
				return {
					...r,
					admin: r._id === id ? admin : r.admin
				};
			})
		);
	};
	return (
		<ModalForm
			onFormSubmit={(event) => event.preventDefault()}
			flash={flash}
			open={openInvite}
			setOpen={setInviteOpen}
			noSubmitButton
			information="Enter invitee's username or email address and they will receive an invite to join your project."
			BoxStyle={{ minWidth: "max-content", width: isMobile ? "95vw" : "600px" }}
			TextFields={[
				<TextField
					error={invalid}
					onChange={({ target }) => setSearch(target.value)}
					onBlur={() => setInvalid(false)}
					helperText={invalid ? flash.message : ""}
					color="secondary"
					name="email_or_username"
					fullWidth
					label="Search by username or email address."
					type="text"
				/>,
				search !== "" && (
					<Box boxShadow={4} style={{background: theme.palette.secondary.main, color: "#fff" }} borderRadius="0.15rem" width="100%">
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
																			color="primary"
																			checked={r.admin}
																			onChange={({ target }) => handleSetAdmin(r._id, target.checked)}
																			name="admin"
																		/>
																	}
																/>
															)}
															<Button variant="contained" color="primary" onClick={() => handleInvite(r._id, r.admin)}>
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
