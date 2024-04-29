import { useState, useEffect } from "react"
import { getUsers } from './../../apiService/userApi'




const Users = () => {

  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers();
      setAllUsers(users);
    };
    fetchData();
  }, []);
  


    return (
      <>
      {allUsers.map((user) => {
        return (
          <>
          <h1>{user.fullName}</h1>
          </>
        )
      })}
      </>
    )}
    
export default Users;