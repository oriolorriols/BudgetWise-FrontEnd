import { useState, useEffect } from "react"
import { getUsers } from '../../apiService/userApi'
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';

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
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

  const [form] = Form.useForm();
  //const [data, setData] = useState(originData);
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
  const handleDelete = (key) => {
    const newData = allUsers.filter((item) => item.key !== key);
    setAllUsers(newData);
  };
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: 'Apellido',
      dataIndex: 'surname',
      width: '20%',
      editable: true,
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
      dataIndex: 'department',
      width: '20%',
      editable: true,
    },
    {
      title: 'Situación',
      dataIndex: 'status',
      width: '15%',
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
