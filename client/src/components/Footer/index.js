import React, { useState } from "react";
import { Typography, Link, useTheme } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Footer = () => {
	const theme = useTheme();
	const location = useLocation();
    const [isDocScrollable, setScrollable] = useState(false);
    const [noFooter, setNoFooter] = useState(
        
    )
	const footerPosition = isDocScrollable ? "static" : "fixed";
	useEffect(() => {
        setScrollable(document.body.scrollHeight > window.innerHeight);
    }, [location.pathname]);
	return (
		!location.pathname.split("/").includes("project") && !location.pathname.split("/").includes("task") && !location.pathname.split("/").includes("dashboard") &&
		location.pathname !==
			"/" && (
				<footer
					style={{
						position: footerPosition,
						bottom: 0,
						background: theme.palette.background.paper,
						color: theme.palette.getContrastText(theme.palette.background.paper)
					}}
				>
					<Typography>
						© 2020 <b>ProjectKanri Team</b>:{" "}
						{[
							{ href: "https://moojigbc.com", name: "Moojig Battsogt" },
							{ href: "https://stadds.dev", name: "Samantha Taddonio" },
							{ href: "https://github.com/mpiarahman16", name: "Mahfuza Pia Rahman" }
						].map(({ href, name }, i, arr) => (
							<React.Fragment>
								<Link color="textPrimary" href={href}>
									{name}
								</Link>
								{i !== arr.length - 1 && ", "}
							</React.Fragment>
						))}
					</Typography>
				</footer>
			)
	);
};

export default Footer;
