import { useAuth } from "../../contexts/authContext"

const DashBoard = () => {
  const { userId, isHR } = useAuth()
  return (
    <>
      <h1>DashBoard</h1> <br />
      <p>USER ID: {userId}</p>
      <p>IS HR?: {isHR}</p>
    </>
  );
}

export default DashBoard;