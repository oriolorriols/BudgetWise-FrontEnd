import { useState, useEffect } from "react";
import { getOneUser, getUsers } from '../../apiService/userApi';
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Space } from 'antd';

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [dummy, refresh] = useState(false);
  const [error, setError] = useState('');
  const { setLogOut } = useAuth();
  const navigate = useNavigate();

  const getAllUsers = async () => {
    const users = await getUsers();
    console.log(users);
    if (users.length) {
      const usersWithDefaultPic = users.map(user => ({
        ...user,
        profilePic: user.profilePic || "/noProfilePic.jpg",
        key: user._id, // asegurarse de que cada registro tenga una clave única
      }));
      setAllUsers(usersWithDefaultPic);
    } else {
      setError(users.msg);
      if (users.error.name === "TokenExpiredError") {
        alert("Token is expired. Please Log In again.");
        setLogOut();
        navigate('/login');
      }
    }
    refresh();
  };

  useEffect(() => {
    getAllUsers();
  }, [dummy]);

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
       {editing ? (
  <Form.Item
    name={dataIndex}
    style={{ margin: 0 }}
    rules={[
      {
        required: true,
        message: `Please Input ${title}!`,
      },
    ]}
  >
    {dataIndex === 'name' ? (
      <Space compact style={{ display: 'flex', width: '100%' }}>
        <Form.Item
          name="name"
          noStyle
          rules={[{ required: true, message: 'Please input name!' }]}
          style={{ margin: 0, flex: '50%' }}
        >
          <Input style={{ width: '100%' }} placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="surname"
          noStyle
          rules={[{ required: true, message: 'Please input surname!' }]}
          style={{ margin: 0, flex: '50%' }}
        >
          <Input style={{ width: '100%' }} placeholder="Surname" />
        </Form.Item>
      </Space>
    ) : dataIndex === 'department' ? ( // Agregar esta condición para el campo "department"
      <Space compact style={{ display: 'flex', width: '100%' }}>
        <Form.Item
          name="departmentId"
          noStyle
          rules={[{ required: true, message: 'Please input departmentId!' }]}
          style={{ margin: 0, flex: '50%' }}
        >
          <Input style={{ width: '100%' }} placeholder="Department ID" />
        </Form.Item>
        <Form.Item
          name="departmentName"
          noStyle
          rules={[{ required: true, message: 'Please input departmentName!' }]}
          style={{ margin: 0, flex: '50%' }}
        >
          <Input style={{ width: '100%' }} placeholder="Department Name" />
        </Form.Item>
      </Space>
    ) : inputNode}
  </Form.Item>
) : (
  children
)}
      </td>
    );
  };

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      position: '',
      address: '',
      department: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...allUsers];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setAllUsers(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setAllUsers(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }
  const handleDelete = async (key) => {
    const newData = allUsers.filter((item) => item.key !== key);
    setAllUsers(newData);
    refresh(!dummy)
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
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: 'Delete',
      dataIndex: 'operation',
      render: (_, record) =>
        allUsers.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={allUsers}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default Users;
