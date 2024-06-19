import React, { useEffect, useState } from 'react'
import { updateDepartment, createDepartment, deleteDepartment } from '../../apiService/departmentApi'
import { Modal, Button, Form, Input, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
}

const DepartmentModal = ({ visible, onCancel, departments, allUsers }) => {
  const [form] = Form.useForm()
  const [deptsToDelete, setDeptsToDelete] = useState([])

  useEffect(() => {
    if (visible && departments) {
      form.setFieldsValue({
        departments: departments.map(dept => ({
          _id: dept._id,
          departmentName: dept.departmentName,
        })),
      })
    }
  }, [visible, departments])

  const onFinishData = async (values) => {
    try {
      const updates = values.departments.filter(dept => dept._id)
      const creates = values.departments.filter(dept => !dept._id)

      await Promise.all(updates.map(dept =>
        updateDepartment(dept._id, { departmentName: dept.departmentName })
      ))

      await Promise.all(creates.map(dept =>
        createDepartment({ departmentName: dept.departmentName })
      ))

      await Promise.all(deptsToDelete.map(id =>
        deleteDepartment(id)
      ))

      message.success("¡Departamentos actualizados!")
      onCancel()
    } catch (error) {
      message.error("Failed to update departments")
      console.error(error)
    } finally {
      setDeptsToDelete([])
    }
  }

  const handleDelete = async (key) => {
    const idToDelete = form.getFieldValue(['departments', key, '_id'])
    
    const usersInDepartment = allUsers.filter(user => user.departmentId._id === idToDelete)
    
    if (usersInDepartment.length > 0) {
      message.error("Para borrar este departamento asegurate que no hay nadie en él.")
    } else {
      const fields = form.getFieldsValue(['departments'])
      const updatedFields = fields.departments.filter((dept, index) => index !== key)
      form.setFieldsValue({ departments: updatedFields })
  
      setDeptsToDelete(prevDepts => [...prevDepts, idToDelete])
    }
  }
  

  const handleCancel = () => {
    onCancel()
    setDeptsToDelete([])
  }

  return (
    <Modal
      title={<h3 style={{ fontSize: '20px' }}>Añadir o editar departamentos</h3>}
      open={visible}
      footer={null}
      onCancel={handleCancel}
      width={700}
    >
  <style jsx>{`
        .dynamic-delete-button {
          position: relative;
          top: 4px;
          margin: 0 8px;
          color: #999;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .dynamic-delete-button:hover {
          color: #777;
        }
        .dynamic-delete-button[disabled] {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>

      <Form
        form={form}
        name="dynamic_form_item"
        {...formItemLayoutWithOutLabel}
        onFinish={onFinishData}
        style={{
          maxWidth: 800,
          marginTop: 20,
        }}
      >
        <Form.List
          name="departments"
          rules={[
            {
              validator: async (_, departments) => {
                if (!departments || departments.length < 1) {
                  return Promise.reject(new Error('Como mínimo un departamento'))
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Form.Item
                  {...formItemLayoutWithOutLabel}
                  required={false}
                  key={key}
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'departmentName']}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Por favor introduce el nombre de un departamento",
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="Nuevo departamento"
                      style={{
                        width: '60%',
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, '_id']}
                    noStyle
                  >
                    <Input type="hidden" />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => {
                        handleDelete(key, name)
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{
                    width: '60%',
                  }}
                  icon={<PlusOutlined />}
                >
                  Añadir Departamento
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Actualizar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DepartmentModal
