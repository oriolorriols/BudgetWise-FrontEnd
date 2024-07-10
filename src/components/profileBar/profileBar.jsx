import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useAuth } from "../../contexts/authContext"
import { getOneUser } from '../../apiService/userApi'
import TokenModal from '../../components/modals/modalToken'


import { 
  Avatar, 
  Button, 
  Flex,
  Dropdown,
} from 'antd';
import './profileBar.scss'


const items = [
  {    
    key: '/perfil',
    label: <a href="/perfil">Ver mi Perfil</a>,
  },
  {    
    key: '/expenses',
    label: <a href="/expenses">Ver mis Gastos</a>,
  },
  {    
    key: '/calendario',
    label: <a href="/calendario">Ver mi Calendario</a>,
  },
];
   

const ProfileBar = () => {
  const navigate = useNavigate()
  const { setLogOut } = useAuth()
  const { userId } = useAuth()
  const [user, setUser] = useState(null);
  const [isModalTokenVisible, setIsModalTokenVisible] = useState(false)

  const handleDropdownItemClick = (key) => {    
    if (key === '/logout') {
      setLogOut()
      navigate('/login')}
      else navigate(key)
  };

  const getUserData = async () => {
    try {
      const data = await getOneUser(userId);
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [userId]);

  return (  
    <>
      <TokenModal
        visible={isModalTokenVisible}
      />
      <div className='profile-bar'>
        <Flex gap={15} wrap justify="flex-end" align="center">
          <Button type="primary">Añadir gasto</Button>
          <p><b>{user?.name} {user?.surname}</b></p>
          <Dropdown 
            menu={{
              onClick: handleDropdownItemClick,
              items: items,
            }}
            trigger={['click']}
          >
            <Avatar size={40} src={user?.profilePic} /> 
          </Dropdown>           
        </Flex> 
      </div>
    </>
  );
};
export default ProfileBar;