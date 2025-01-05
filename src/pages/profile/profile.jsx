import React, { useEffect, useState } from 'react'
import { getOneUser, updateUser, updateUserPic } from '../../apiService/userApi'
import { useAuth } from "../../contexts/authContext"
import TokenModal from '../../components/modals/modalToken'
import { UploadOutlined } from '@ant-design/icons'
import ProfileBar from '../../components/profileBar/profileBar'
import dayjs from 'dayjs'
import './profile.scss'
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  Space,
  DatePicker,
  message,
  Spin,
  Flex,
  Col
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

const Profile = () => {
  const [isModalTokenVisible, setIsModalTokenVisible] = useState(false)
  const { userId } = useAuth()
  const [user, setUser] = useState({})
  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState({})
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(true)

  const getUserData = async () => {
    setLoading(true)
    try {
      const data = await getOneUser(userId)
      setUser(data)
      console.log(data)
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true)
      } else {
        if (data.profilePic === "" || !data.profilePic) data.profilePic = "/noProfilePic.jpg"
        const formValues = {
          name: data.name,
          surname: data.surname,
          dni: data.dni,
          status: data.status,
          address: data.address,
          email: data.email,
          phoneNumber: data.phoneNumber,
          position: data.position,
          personalMail: data.personalMail,
          phoneExt: data.phoneExt,
          bankAccount: data.bankAccount,
          birthDate: data.birthDate ? dayjs(data.birthDate) : null,
        }
        setInitialValues(formValues)
        form.setFieldsValue(formValues)
        setLoading(false)
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
      form.resetFields(['password', 'password2'])
      setShowConfirmPassword(false)
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

  const handleReset = () => {
    form.setFieldsValue(initialValues)
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setShowConfirmPassword(!!value)
    form.validateFields(['password2'])
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <>
      <TokenModal
        visible={isModalTokenVisible}
      />
      <Flex wrap justify="space-between" align="flex-start">
        <div className="title-box">
          <h1 className='title'>¡Bienvenido de nuevo, {user.name}!</h1>
          <h2 className='subtitle'>Aquí puedes ver y modificar los datos de tu perfil</h2>
        </div>
        <ProfileBar />
      </Flex>
      <div className='flex'>
        <Col span={6}>
          <div className='profile-info-box max-w-72 h-fit p-9 mr-8'>
            <div className="mt-2 mb-5">
              <p className='text-xl font-bold text-center'>{user?.companyId?.companyName}</p>
              <p className='text-md font-medium text-center'>{user?.departmentId?.departmentName}</p>
            </div>
            <div className='profile-img mt-8 overflow-hidden'>
              <img className='aspect-square object-cover' src={user.profilePic} alt="" />
            </div>
            <div className='mt-5 mb-8 profile-user-data'>
              <h3 className='font-medium text-center'>{user.name} {user.surname}</h3>
              <p className='text-center'>{user.email}</p>
              <p className='text-center'>{user.dni}</p>
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
          </div>
        </Col>
        <Col span={18}>
          <Form
            form={form}
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinishData}
            style={{ width: 650 }}
          >
            <h2 className='text-lg font-bold mb-7'>Datos Personales</h2>
            <Form.Item
              className='w-full'
              name="name"
              label="Nombre"
              rules={[{ required: true, message: 'Introduce tu nombre!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className='w-full'
              name="surname"
              label="Apellidos"
              rules={[{ required: true, message: 'Introduce tus apellidos!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[{ required: true, message: 'Introduce tu correo electrónico' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className='w-full'
              name="dni"
              label="DNI"
              rules={[{ required: true, message: 'Introduce tu DNI!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className='w-full'
              name="position"
              label="Posición"
              rules={[{message: 'Introduce tu posición!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className='w-full'
              name="status"
              label="Estado"
              rules={[{ message: 'Selecciona un estado' }]}
            >
              <Select>
                <Option value="Alta">Alta</Option>
                <Option value="Baja">Baja</Option>
                <Option value="Baja medica">Baja medica</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Dirección"
              name="address"
              rules={[{ message: 'Introduce una dirección!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="E-mail Personal"
              name="personalMail"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Móvil"
              name="phoneNumber"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Extensión"
              name="phoneExt"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="IBAN"
              name="bankAccount"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Fecha de Nacimiento"
              name="birthDate"
            >
              <DatePicker format={dateFormat} />
            </Form.Item>

            <Form.Item
              label="Actualizar Contraseña"
              name="password"
            >
              <Input.Password onChange={handlePasswordChange} />
            </Form.Item>
            {showConfirmPassword && (
              <Form.Item
                label="Confirmar Contraseña"
                name="password2"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'Por favor, confirma tu contraseña',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Las contraseñas tienen que coincidir'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}
            <Form.Item
              wrapperCol={{ span: 12, offset: 6 }}
            >
              <Space>
                <Button type="primary" htmlType="submit">
                  Actualizar
                </Button>
                <Button htmlType="button" onClick={handleReset}>Restablecer</Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </div>
    </>
  )
}

export default Profile
