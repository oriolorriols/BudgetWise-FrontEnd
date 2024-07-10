import { useState, useEffect } from "react";
import './users.scss';
import { getUsers } from '../../apiService/userApi';
import { getDepartments } from '../../apiService/departmentApi';
import { useSocket } from "../../contexts/socketContext";

import { Form, Table, Typography, Button, Space, Input, Tooltip, Flex } from 'antd';
import TokenModal from '../../components/modals/modalToken';
import UserFormModal from '../../components/modals/modalUserForm';
import DepartmentModal from '../../components/modals/modalDepartments';

const Users = () => {
  const [isModalTokenVisible, setIsModalTokenVisible] = useState(false);
  const [isModalUserVisible, setIsModalUserVisible] = useState(false);
  const [isModalDeparmentVisible, setIsModalDepartmentVisible] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [company, setCompany] = useState();
  const [departments, setDepartments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [dummy, refresh] = useState(false);

  const [filtering, setFiltering] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [loading, setLoading] = useState(true);

  const { connectedUsers } = useSocket();

  const checkTokenValidity = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsModalTokenVisible(true);
      return false;
    }
    return true;
  };

  const getDepartmentsData = async () => {
    try {
      const data = await getDepartments();
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true);
      } else {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Failed to fetch departments data", error);
    }
  };

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true);
      } else {
        const usersWithDefaultPic = data.map(user => ({
          ...user,
          profilePic: user.profilePic || "/noProfilePic.jpg",
          key: user._id,
        }));
        const updatedUsers = usersWithDefaultPic.map(user => ({
          ...user, 
          isOnline: connectedUsers.includes(user._id),
        }));
        setAllUsers(updatedUsers);
        const companyName = data[0]?.companyId?._id || null;
        setCompany(companyName);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch company data", error);
    }
  };

  useEffect(() => {
    const updateUsersOnlineStatus = () => {
      const updatedUsers = allUsers.map(user => ({
        ...user, 
        isOnline: connectedUsers.includes(user._id),
      }));
      setAllUsers(updatedUsers);
    };

    updateUsersOnlineStatus();
  }, [connectedUsers]);

  useEffect(() => {
    getAllUsers();
    getDepartmentsData();
  }, [dummy]);

  useEffect(() => {
    if (filtering.length) {
      onSearch(searchValue);
    }
  }, [allUsers]);

  const [form] = Form.useForm();

  const handleEdit = (record) => {
    if (checkTokenValidity()) {
      setSelectedUser(record);
      setIsModalUserVisible(true);
    }
  };

  const handleAddUser = () => {
    if (checkTokenValidity()) {
      setSelectedUser(null);
      setIsModalUserVisible(true);
    }
  };

  const handleCancelUser = () => {
    setIsModalUserVisible(false);
    setSelectedUser(null);
  };

  const { Search } = Input;

  const onSearch = (value) => {
    setSearchValue(value);
    const filteredData = allUsers.filter(user => {
      const nameMatch = user.name?.toLowerCase().includes(value.toLowerCase());
      const positionMatch = user.position?.toLowerCase().includes(value.toLowerCase());
      const phoneExtMatch = user.phoneExt?.toLowerCase().includes(value.toLowerCase());
      const departmentMatch = user.departmentId?.departmentName?.toLowerCase().includes(value.toLowerCase());
      const statusMatch = user.status?.toLowerCase().includes(value.toLowerCase());
      const dniMatch = user.dni?.toLowerCase().includes(value.toLowerCase());
      return nameMatch || positionMatch || phoneExtMatch || departmentMatch || statusMatch || dniMatch;
    });
    setFiltering(filteredData);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: '18%',
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={record.profilePic} 
              alt="profile" 
              draggable="false"
              style={{ 
                aspectRatio: '1/1', 
                objectFit: 'cover', 
                borderRadius: '50%',
                width: 40,
                marginRight: 12 
              }} 
            />
            <Tooltip title={record.isOnline ? "Online" : "Offline"}>
            {record.confirmed ? (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: 5,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: record.isOnline ? '#5fb75f' : '#cf1d1d',
                }}
              ></span>
            ) : null}
            </Tooltip>
          </div>
          <p>{record.name} {record.surname} {!record.confirmed && (
            <Tooltip title="Falta por confirmar el email">
            <span style={{ color: 'red', fontStyle: 'italic', marginLeft: 0 }}>
              (Pendiente)
            </span>
            </Tooltip>
          )}</p>
        </div>
      ),
    },
    {
      title: 'Departamento',
      dataIndex: ['departmentId', 'departmentName'],
      width: '12%',
      sorter: (a, b) => (a.departmentId?.departmentName || "").localeCompare(b.departmentId?.departmentName || ""),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '17%',
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: 'Extensión',
      dataIndex: 'phoneExt',
      width: '5%',
      sorter: (a, b) => (a.phoneExt || "").localeCompare(b.phoneExt || ""),
    },
    {
      title: 'Posición',
      dataIndex: 'position',
      width: '15%',
      sorter: (a, b) => (a.position || "").localeCompare(b.position || ""),
    },
    {
      title: 'Situación',
      dataIndex: 'status',
      width: '10%',
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    },
    {
      title: 'DNI',
      dataIndex: 'dni',
      width: '10%',
    },
    {
      title: 'Editar',
      dataIndex: 'operation',
      width: '10%',
      render: (_, record) => (
        <Typography.Link onClick={() => handleEdit(record)}>
          Editar
        </Typography.Link>
      ),
    },
  ];

  return (
    <>
          <Flex wrap justify="space-between" align="flex-start">
                <div className="title-box">
                <h1 className='title'>Lista de empleados</h1>
                <h2 className='subtitle'>Busca los detalles de todos los empleados de la empresa</h2>
                </div>
            </Flex>
      
      <div className="flex justify-between my-5">  
        <div>
          <Button className="mr-5" type="primary" onClick={handleAddUser}>
              Añadir Usuario
          </Button>
          <Button className="" type="primary" onClick={() => setIsModalDepartmentVisible(true)}>
              Editar Departamentos
          </Button>
        </div>
        <Space direction="vertical">
          <Search
              placeholder="Buscar texto..."
              allowClear
              enterButton="Buscar"
              size="large"
              onSearch={onSearch}
          />
        </Space> 
      </div>

      <TokenModal visible={isModalTokenVisible} />
      <UserFormModal
        visible={isModalUserVisible}
        user={selectedUser}
        onCancel={handleCancelUser}
        departments={departments}
        companyId={company}
        refresh={refresh}
      />
      <DepartmentModal
        visible={isModalDeparmentVisible}
        onCancel={() => setIsModalDepartmentVisible(false)}
        departments={departments}
        allUsers={allUsers}
        companyId={company}
        refresh={refresh}
      />
      <Form form={form} component={false}>
      <Table
          dataSource={filtering.length > 0 ? filtering : allUsers}
          columns={columns}
          loading={loading}
          rowClassName={(record) => (record.confirmed ? '' : 'unconfirmed-row')}
        />
      </Form>
    </>
  )
}

export default Users
