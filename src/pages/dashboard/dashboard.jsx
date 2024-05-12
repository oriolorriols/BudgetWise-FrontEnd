import { Link, useNavigate } from "react-router-dom";

const DashBoard = () => {

const navigate = useNavigate()

  const logout = () => {//funcion que elimina el token al cerrar sesion
    localStorage.removeItem('access_token')
    navigate('/login')
  } 

    return (
      <>
    <h1>DashBoard</h1> <br />
    <Link to="/login">Login</Link> <br />
    <button onClick={logout}>Cerrar sesión</button>
      </>
    )}
    
export default DashBoard;