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


const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    department: "FSD", 
    address: `London Park no. ${i}`,
  });
}

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

//  const [allUsers, setAllUsers] = useState([])
//
//  useEffect(() => {
//    const fetchData = async () => {
//      const users = await getUsers();
//      setAllUsers(users);
//    };
//    fetchData();
//  }, []);

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
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
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }
  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'Apellido',
      dataIndex: 'surname',
      width: '20%',
      editable: true,
    },
    {
      title: 'Edad',
      dataIndex: 'age',
      width: '5%',
      editable: true,
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      width: '30%',
      editable: true,
    },
    {
      title: 'Departamento',
      dataIndex: 'department',
      width: '40%',
      editable: true,
    },
    {
      title: 'Situación',
      dataIndex: 'isSick',
      width: '40%',
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
        data.length >= 1 ? (
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
        dataSource={data}
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
