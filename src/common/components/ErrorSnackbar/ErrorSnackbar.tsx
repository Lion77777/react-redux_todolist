import { selectAppError } from "@/app/app-selectors"
import { setAppErrorAC } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Alert, Snackbar } from "@mui/material"
import { SyntheticEvent } from "react"

export const ErrorSnackbar = () => {
    const error = useAppSelector(selectAppError)
    const dispatch = useAppDispatch()

    const handleClose = (_: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        dispatch(setAppErrorAC({ error: null }))
    }

    return (
        <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
                {error}
            </Alert>
        </Snackbar>
    )
}