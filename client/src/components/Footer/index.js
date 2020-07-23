import React from "react"
import { Typography, Link, makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        padding: '0.25rem',
        position: "fixed",
        bottom: 0,
        width: "100%"
    }
}))

const Footer = () => {
    const classes = useStyles()
    return (
        <footer className={classes.root}>
            <Typography>©<Link color="textPrimary" href="https://github.com/moojigc/">Moojig Battsogt</Link>, Samantha Taddonio, & Mahfuza Pia Rahman</Typography>
        </footer>
    )
}

export default Footer;