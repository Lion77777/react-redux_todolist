import { selectThemeMode } from "@/app/app-selectors"
import { useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CheckBox from "@mui/icons-material/CheckBox"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { SubmitHandler, useForm } from "react-hook-form"
import styles from './Login.module.css'

export const Login = () => {
    const themeMode = useAppSelector(selectThemeMode)
    const theme = getTheme(themeMode)
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm<LoginInputs>({ defaultValues: { email: '', password: '', rememberMe: false } })

    const onSubmit: SubmitHandler<LoginInputs> = data => {
        console.log(data)
    }

    return (
        <Grid container justifyContent={'center'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To login get registered
                            <a href="https://social-network.samuraijs.com"
                                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                                target="_blank"
                                rel="noreferrer"
                            >here</a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>
                            <b>Email:</b> free@samuraijs.com
                        </p>
                        <p>
                            <b>Password:</b> free
                        </p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email" 
                                    margin="normal" 
                                    error={!!errors.email}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: 'Incorrect email address'
                                        }
                                    })} 
                        />
                        {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                        <TextField type="password" label="Password" margin="normal" {...register('password')} />
                        <FormControlLabel label="Remember me" control={<CheckBox {...register('rememberMe')} />} />
                        <Button type="submit" variant="contained" color="primary">Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    )
}

type LoginInputs = {
    email: string
    password: string
    rememberMe: boolean
}