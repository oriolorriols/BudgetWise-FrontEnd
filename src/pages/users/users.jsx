import { useState, useEffect } from "react"
import { getUsers } from '../../apiService/userApi'
//import SideBar from '../../components/sidebar/sidebar'

const Users = () => {
  const [allUsers, setAllUsers] = useState([])
  const [dummy, refresh] = useState(false)
  const [error, setError] = useState('')

  const getAllUsers = async () => {
    const users = await getUsers();
    if (users.length) setAllUsers(users);
    else setError(users.message)
  }

  useEffect(() => {
    getAllUsers()
  }, [dummy]);

  return (
    <>
      <div className="">
        <p>Usuarios de prueba</p> <br />
        {allUsers.map((user, index) => (
          <div key={index}>
            <h1>{user.email}</h1>
          </div>
        ))}
        {error && <p>Ha habido un error: {error}</p>}
      </div>
    </>
  );
}

export default Users;
