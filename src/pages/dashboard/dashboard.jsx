import { useAuth } from "../../contexts/authContext"

const DashBoard = () => {
  const { token, userId, isHR } = useAuth()
  return (
    <>
      <h1>DashBoard</h1> <br />
      <p>{isHR}</p>
    </>
  );
}

export default DashBoard;