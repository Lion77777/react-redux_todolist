import { Main } from "@/app/Main"
import { Login } from "@/features/auth/ul/Login/Login"
import { Route, Routes } from "react-router"
import { PageNotFound } from "../components"

export const Path = {
    Main: '/',
    Login: 'login',
    NotFound: '*'
} as const

export const Routing = () => {

    return (
        <Routes>
            <Route path={Path.Main} element={<Main />} />
            <Route path={Path.Login} element={<Login />} />
            <Route path={Path.NotFound} element={<PageNotFound />} />
        </Routes>
    )
}