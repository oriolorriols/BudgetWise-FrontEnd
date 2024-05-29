import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext"

export const PrivateRoutes = () => {
    const { isAuthenticated } = useAuth()

    return(
        isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
    )

}