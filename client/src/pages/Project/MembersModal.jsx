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
import projectAPI from "../../utils/projectAPI";

const MembersModal = ({ setProject, project, projectId, userIsOwner, members, admins, open, setOpen }) => {
	const [flash, setFlash] = useState({ message: null, type: null }),
		[invalid, setInvalid] = useState(true),
		[members, setMembers] = useState([]),
		[inProgress, setInProgress] = useState(false),
		isMobile = useMediaQuery("(max-width: 960px)"),
		theme = useTheme(),
		handleInvite = async (id, admin) => {
			let res = await inviteAPI.sendInvite(projectId, admin, id);
			setFlash(res.flash);
		};
	useEffect(() => {
		setInvalid(flash.type === "error");
    }, [flash.type]);
    /**
     * 
     * @param {"makeAdminNew" | "makeAdminExisiting" | "removeAdminRights" | "removeMember"} action 
     */
	const handleUpdate = async (action, id) => {
        let res = await projectAPI.membersDispatch(action, projectId, id)
        setFlash(res.flash)
        let project = await projectAPI.getProject(projectId)
        setProject(project)
    }
	return (
		<ModalForm
			onFormSubmit={(event) => event.preventDefault()}
			flash={flash}
			open={openInvite}
			setOpen={setInviteOpen}
			noSubmitButton
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
								members.length ? (
									<List style={{ width: "inherit" }}>
										{members.map((r, i, arr) => (
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
															{userIsOwner && (
																<Button onClick={() => handleUpdate("makeAdminExisiting", r._id)}>
                                                                    Make Admin
                                                                </Button>
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

export default MembersModal;
