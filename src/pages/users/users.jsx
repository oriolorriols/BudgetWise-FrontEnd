import { useState, useEffect } from "react"
import { getUsers, updateUser, createUser } from '../../apiService/userApi'
import { getDepartments } from '../../apiService/departmentApi'
import { Form, Table, Typography, Button, message } from 'antd'
import TokenModal from '../../components/modals/modalToken'
import UserFormModal from '../../components/modals/modalUserForm'

const Users = () => {
  const [isModalTokenVisible, setIsModalTokenVisible] = useState(false)
  const [isModalUserVisible, setIsModalUserVisible] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [company, setComapny] = useState()
  const [departments, setDepartments] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  const checkTokenValidity = () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      setIsModalTokenVisible(true)
      return false
    }
    return true
  }

  const getDepartmentsData = async () => {
    try {
      const data = await getDepartments()
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true)
      } else {
        setDepartments(data)
        console.log(data)
      }
    } catch (error) {
      console.error("Failed to fetch departments data", error)
    }
  }

  const getAllUsers = async () => {
    try {
      const data = await getUsers()
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true)
      } else {
        const usersWithDefaultPic = data.map(user => ({
          ...user,
          profilePic: user.profilePic || "/noProfilePic.jpg",
          key: user._id,
        }))
        setAllUsers(usersWithDefaultPic)
        const companyName = data[0].companyId._id
        setComapny(companyName)
        console.log(usersWithDefaultPic)
      }
    } catch (error) {
      console.error("Failed to fetch company data", error)
    }
  }

  useEffect(() => {
    if (!isModalUserVisible) {
      getAllUsers()
    }
  }, [isModalUserVisible])

  useEffect(() => {
    getDepartmentsData()
  }, [])

  const [form] = Form.useForm()

  const handleEdit = (record) => {
    if (checkTokenValidity()) {
      setSelectedUser(record)
      setIsModalUserVisible(true)
    }
  }

  const handleAddUser = () => {
    if (checkTokenValidity()) {
      setSelectedUser(null)
      setIsModalUserVisible(true)
    }
  }

  const handleCancel = () => {
    setIsModalUserVisible(false)
    setSelectedUser(null)
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: '15%',
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
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      width: '20%',
    },
    {
      title: 'Departamento',
      dataIndex: ['departmentId', 'departmentName'],
      width: '20%',
    },
    {
      title: 'Situación',
      dataIndex: 'status',
      width: '10%',
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
  ]

  return (
    <>
      <Button type="primary" onClick={handleAddUser}>
        Añadir Usuario
      </Button>
      <TokenModal visible={isModalTokenVisible} />
      <UserFormModal
        visible={isModalUserVisible}
        user={selectedUser}
        onCancel={handleCancel}
        departments={departments}
        companyId={company}
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
