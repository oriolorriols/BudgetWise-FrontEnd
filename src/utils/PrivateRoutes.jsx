import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext"

export const PrivateRoutes = () => {
    const { token } = useAuth()

    return(
        token ? <Outlet/> : <Navigate to="/login"/>
    )

}