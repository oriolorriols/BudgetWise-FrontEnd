import { useState, useEffect } from "react"
import { getUsers } from '../../apiService/userApi'
import SideBar from '../../components/sidebar/sidebar'

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
      <div className="">
        {allUsers.map((user, index) => (
          <div key={index}>
            <h1>{user.fullName}</h1>
          </div>
        ))}
      </div>
    </>
  );
}

export default Users;
