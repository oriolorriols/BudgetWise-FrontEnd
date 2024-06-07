import React, { useEffect, useState } from 'react'
import { useAuth } from "../../contexts/authContext"
import { getOneUser } from '../../apiService/userApi'
import { getCompany } from '../../apiService/companyApi'
import { updateUserPic } from '../../apiService/profileApi'
import { useNavigate } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  Space,
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

const CompanyProfile = () => {
  const navigate = useNavigate()
  const { userId, setLogOut } = useAuth()
  const [ companyData, setCompanyData] = useState({})
  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState({})

  const getCompanyData = async () => {
    try {
      const user = await getOneUser(userId)
      console.log(user)
      const company = await getCompany(user.companyId)
      setCompanyData(company)
      console.log(company)
      
      if (user.error && user.error.name === "TokenExpiredError") {
        alert("Token is expired. Please Log In again.")
        setLogOut()
        navigate('/login')
      } else {
        if (company.companyLogo === "" || !company.companyLogo) company.companyLogo = "/noProfilePic.jpg"
        const formValues = {
          companyName: company.companyName,
          companyCity: company.companyCity,
          companyPhone: company.companyPhone,
          companyPostalCode: company.companyPostalCode,
          companyPlan: company.companyPlan,
          companyCountry: company.companyCountry,
          companyAddress: company.companyAddress
        }
        setInitialValues(formValues)
        form.setFieldsValue(formValues)
      }
    } catch (error) {
      console.error("Failed to fetch user data", error)
    }
  }

  useEffect(() => {
    if (userId) {
      getCompanyData()
    }
  }, [userId])

  const onFinishData = async (values) => {
    try {
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


  const handleReset = () => {
    form.setFieldsValue(initialValues)
  }


  return (
    <>
      <div className='mb-5'>
        <h2 className='font-medium text-2xl'>Datos de {companyData.companyName}</h2>
      </div>
      <div className='flex'>
        <div className='bg-green-200 rounded-lg max-w-72 h-fit p-5 mr-10'>
          <div className='overflow-hidden rounded-full'>
            <img className='aspect-square object-cover' src={companyData.companyLogo} alt="" />
          </div>
          <div className='text-center mt-4'>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Selecciona tu logotipo</Button>
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
          <div className='mt-5 mb-2'>
            <p className='font-bold text-center'>{companyData.companyName}</p>
            <p className='text-center'>{companyData.companyCity}</p>
            <p className='text-center'>{companyData.companyCountry}</p>
          </div>
        </div>
        <Form
          form={form}
          name="validate_other"
          {...formItemLayout}
          onFinish={onFinishData}
          style={{ width: 650 }}
        >
          <h2 className='text-lg font-bold mb-7'>Datos de la empresa</h2>
          <Form.Item
            className='w-full'
            name="companyName"
            label="Nombre"
            rules={[{ required: true, message: 'Introduce tu nombre!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='w-full'
            name="companyCountry"
            label="País"
            rules={[{message: 'Introduce tu posición!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='w-full'
            name="companyCity"
            label="Ciudad"
            rules={[{ required: true, message: 'Introduce tu DNI!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='w-full'
            name="companyAddress"
            label="Dirección"
            rules={[{ required: true, message: 'Introduce tus apellidos!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='w-full'
            name="companyPostalCode"
            label="Codigo Postal"
            rules={[{message: 'Introduce tu posición!' }]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item
            label="Teléfono"
            name="companyPhone"
            rules={[{ required: true, message: 'Introduce tu correo electrónico' }]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            className='w-full'
            name="companyPlan"
            label="Plan"
            rules={[{ message: 'Selecciona un estado' }]}
          >
            <Select>
              <Option value="Small">Pequeña Empresa (1-50)</Option>
              <Option value="Medium">Mediana Empresa (50-150)</Option>
              <Option value="Large">Gran Empresa (+150)</Option>
            </Select>
          </Form.Item>

            
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
      </div>
    </>
  )
}

export default CompanyProfile
