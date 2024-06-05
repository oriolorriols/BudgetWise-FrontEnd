import React, { useEffect, useState } from 'react'
import { useAuth } from "../../contexts/authContext"
import { getOneUser, updateUser } from '../../apiService/userApi'
import { updateUserPic } from '../../apiService/profileApi'
import { useNavigate } from 'react-router-dom'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  Space,
  DatePicker,
  message,
} from 'antd'

const { Option } = Select
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const Perfil = () => {
  const navigate = useNavigate()
  const { userId, setLogOut } = useAuth()
  const [user, setUser] = useState({})
  const [form] = Form.useForm()

  const getUserData = async () => {
    try {
      const data = await getOneUser(userId)
      setUser(data)
      console.log(data)
      if (data.error && data.error.name === "TokenExpiredError") {
        alert("Token is expired. Please Log In again.")
        setLogOut()
        navigate('/login')
      } else {
        form.setFieldsValue({
          name: data.name,
          surname: data.surname,
          status: data.status,
          address: data.address,
          email: data.email,
          phoneExt: data.phoneExt,
        })
      }
    } catch (error) {
      console.error("Failed to fetch user data", error)
    }
  }

  useEffect(() => {
    if (userId) {
      getUserData()
    }
  }, [userId])

  const onFinishData = async (values) => {
    try {
      await updateUser(userId, values)
      await getUserData()
      message.success("User data updated successfully!")
    } catch (error) {
      message.error("Failed to update user data")
      console.error(error)
    }
  }

  const handleUpload = async () => {
    const file = fileList[0]
    if (!file) return

    setUploading(true)
    try {
      await updateUserPic(file)
      await getUserData()
      setFileList([])
      message.success("Profile picture updated successfully!")
    } catch (error) {
      message.error("Failed to update profile picture")
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)
  
  const props = {
    onRemove: (file) => {
      setFileList((prevFileList) => prevFileList.filter((f) => f.uid !== file.uid))
    },
    beforeUpload: (file) => {
      setFileList([file])
      return false
    },
    fileList,
  }

  const dateFormat = 'YYYY/MM/DD'

  return (
    <>  
      <div className='mb-5'>
        <h2 className='font-medium text-2xl'>Hola, {user.name}!</h2>
      </div>
      <div className='flex'>
        <div className='bg-green-200 rounded-lg max-w-72 h-fit p-5 mr-10'>
          <div className='overflow-hidden rounded-full'>
            <img className='aspect-square object-cover' src={user.profilePic} alt="" />
          </div>
          <div className='text-center mt-4'>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Selecciona tu avatar</Button>
            </Upload>
            {fileList.length > 0 && (
              <Button
                type="primary"
                onClick={handleUpload}
                loading={uploading}
                style={{ marginTop: 16 }}
              >
                {uploading ? 'Subiendo' : 'Actualizar'}
              </Button>
            )}
          </div>
          <div className='mt-5'>
            <p className='font-medium text-center'>{user.name} {user.surname}</p>
            <p className='text-center'>{user.email}</p>
            <p className='text-center'>{user.dni}</p>
            <p className='mt-5 font-medium text-center'>{user.profileType}</p>
          </div>
        </div>
        <Form 
          form={form}
          name="validate_other"
          {...formItemLayout}
          onFinish={onFinishData}
          style={{ width: 600 }}
        >
          <h2 className='text-lg font-bold mb-2'>Datos Personales</h2>
          <div className="flex">
            <Form.Item
              className='w-full'
              name="name"
              label="Nombre"
              rules={[{ required: true, message: 'Introduce un nombre!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className='w-full'
              name="surname"
              label="Apellidos"
              rules={[{ required: true, message: 'Introduce un apellido!' }]}
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item
            className='w-full'
            name="status"
            label="Estado"
            hasFeedback
            rules={[{ required: true, message: 'Selecciona un estado' }]}
          >
            <Select>
              <Option value="Alta">Alta</Option>
              <Option value="Baja">Baja</Option>
              <Option value="Baja medica">Baja medica</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Introduce una dirección!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Introduce tu correo electrónico' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneExt"
            rules={[{ required: true, message: 'Introduce tu extensión' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Data Nacimiento">
            <DatePicker defaultValue={dayjs('2015/01/01', dateFormat)} />
          </Form.Item>
          <Form.Item
            wrapperCol={{ span: 12, offset: 6 }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default Perfil
