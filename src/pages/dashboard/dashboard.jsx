import { useAuth } from "../../contexts/authContext"

const DashBoard = () => {
  const { token } = useAuth()
  return (
    <>
      <h1>DashBoard</h1> <br />
      <p>{token}</p>
    </>
  );
}

export default DashBoard;