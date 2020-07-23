import React from 'react'
import ModalForm from '../../components/ModalForm'
import { useMediaQuery, Divider, Grid, Button } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

export default function DeleteModal({ task, flash, onFormSubmit, open, setOpen }) {
    const isMobile = useMediaQuery("(max-width: 960px)")
    return (
        <ModalForm
        noSubmitButton
        onFormSubmit={onFormSubmit}
        open={open}
        setOpen={setOpen}
        flash={flash}
        information={`Are you sure you want to delete this ${task ? "task" : "project"} forever?`}
        BoxStyle={{ minWidth: "50vw", width: isMobile ? "90%" : "600px" }}
        TextFields={[
            <Divider />,
            <Grid container justify="space-around">
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" style={{background: red[300] }}>Yes, Delete</Button>
            </Grid>
        ]}
    />
    )
}