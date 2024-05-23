import { useAuth } from "../../contexts/authContext"

const DashBoard = () => {
  const { token, userId, isHR } = useAuth()
  return (
    <>
      <h1>DashBoard</h1> <br />
      <p>TOKEN: {token}</p>
      <p>USER ID: {userId}</p>
      <p>IS HR?: {isHR}</p>
    </>
  );
}

export default DashBoard;