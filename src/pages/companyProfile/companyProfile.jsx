import React, { useEffect, useState } from 'react'
import { useAuth } from "../../contexts/authContext"
import TokenModal from '../../components/modals/modalToken'
import { getOneUser } from '../../apiService/userApi'
import { getCompany, updateCompany, updateCompanyLogo } from '../../apiService/companyApi'
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
  const [isModalTokenVisible, setIsModalTokenVisible] = useState(false)
  const { userId } = useAuth()
  const [ companyData, setCompanyData] = useState({})
  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState({})

  const getCompanyData = async () => {
    try {
      const data = await getOneUser(userId)
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true)
      }
      else {
        const company = await getCompany(data.companyId._id)
        setCompanyData(company)
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
      console.error("Failed to fetch company data", error)
    }
  }

  useEffect(() => {
    if (userId) {
      getCompanyData()
    }
  }, [userId])

  const onFinishData = async (values) => {
    try {
      await updateCompany(companyData._id, values)
      await getCompanyData()
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
      await updateCompanyLogo(file, companyData._id)
      await getCompanyData()
      setFileList([])
      message.success("Company logo updated successfully!")
    } catch (error) {
      message.error("Failed to update company logo")
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
      <TokenModal
        visible={isModalTokenVisible}
      />
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
            rules={[{ required: true, message: 'Introduce el nombre!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='w-full'
            name="companyCountry"
            label="País"
            rules={[{ required: true, message: 'Introduce el país!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='w-full'
            name="companyCity"
            label="Ciudad"
            rules={[{ required: true, message: 'Introduce la ciudad!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='w-full'
            name="companyAddress"
            label="Dirección"
            rules={[{ required: true, message: 'Introduce la dirección!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='w-full'
            name="companyPostalCode"
            label="Codigo Postal"
            rules={[{ required: true, message: 'Introduce el codigo postal!' }]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item
            label="Teléfono"
            name="companyPhone"
            rules={[{ required: true, message: 'Introduce el teléfono' }]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            className='w-full'
            name="companyPlan"
            label="Plan"
            rules={[{ message: 'Selecciona un plan' }]}
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
