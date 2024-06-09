import { useState, useEffect } from "react"
import { getUsers } from '../../apiService/userApi'
import { getDepartments } from '../../apiService/departmentApi'
import { Form, Table, Typography } from 'antd'
import TokenModal from '../../components/modals/modalToken'
import UserFormModal  from '../../components/modals/modalUserForm'

const Users = () => {
  const [isModalTokenVisible, setIsModalTokenVisible] = useState(false)
  const [isModalEditUserVisible, setIsModalEditUserVisible] = useState(false)

  const [allUsers, setAllUsers] = useState([])
  const [departments, setDepartments] = useState()

  const [error, setError] = useState('')
  
  const [selectedUser, setSelectedUser] = useState(null)


  const getDepartmentsData = async () => {
    try {
      const data = await getDepartments()
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true)}
      setDepartments(data)
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch departments data", error)
    }
  }

  const getAllUsers = async () => {
    const data = await getUsers()
    if (data.length) {
      const usersWithDefaultPic = data.map(user => ({
        ...user,
        profilePic: user.profilePic || "/noProfilePic.jpg",
        key: user._id,
      }));
      setAllUsers(usersWithDefaultPic)
      console.log(usersWithDefaultPic)
    } else {
      setError(data.msg);
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true);
      }
    }
  };

  useEffect(() => {
    if (!isModalEditUserVisible) {
      getAllUsers();
    }
  }, [isModalEditUserVisible]);

  useEffect(() => {
    getDepartmentsData()
  }, [])


  const [form] = Form.useForm();

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsModalEditUserVisible(true);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: '15%',
      editable: true,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={record.profilePic} 
            alt="profile" 
            draggable="false"
            style={{ 
              aspectRatio: '1/1', 
              objectFit: 'cover', 
              borderRadius: 100,
              width: 40,
              marginRight: 8 
            }} 
          />
          {record.name} {record.surname}
        </div>
      ),
    },
    {
      title: 'Posición',
      dataIndex: 'position',
      width: '20%',
      editable: true,
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      width: '20%',
      editable: true,
    },
    {
      title: 'Departamento',
      dataIndex: ['departmentId', 'departmentName'],
      width: '20%',
      editable: true,
    },
    {
      title: 'Situación',
      dataIndex: 'status',
      width: '10%',
      editable: true,
    },
    {
      title: 'Editar',
      dataIndex: 'operation',
      render: (_, record) => (
        <Typography.Link onClick={() => handleEdit(record)}>
          Editar
        </Typography.Link>
      ),
    },
  ];

  return (
    <>
      <TokenModal visible={isModalTokenVisible} />
      <UserFormModal
        visible={isModalEditUserVisible}
        user={selectedUser}
        onCancel={() => setIsModalEditUserVisible(false)}
        departments={departments}
      />
      <Form form={form} component={false}>
        <Table
          dataSource={allUsers}
          columns={columns}
        />
      </Form>
    </>
  )
}

export default Users
