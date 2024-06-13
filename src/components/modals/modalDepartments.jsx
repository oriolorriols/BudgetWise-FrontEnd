import React, { useEffect } from 'react'
import { updateDepartment } from '../../apiService/departmentApi'
import { Modal, Button, Form, Input, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
}

const DepartmentModal = ({ visible, onCancel, departments }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && departments) {
      form.setFieldsValue({
        names: departments.map(dept => dept.departmentName)
      });
    }
  }, [visible, departments]);

  const onFinishData = async (values) => {
    try {
    console.log(values)
     // await Promise.all(values.names.map(name => updateDepartment(name)));
      message.success("Departments updated successfully!")
      onCancel()
    } catch (error) {
      message.error("Failed to update departments")
      console.error(error)
    }
  };

  return (
    <Modal
      title={<h3 style={{ fontSize: '20px' }}>Añadir o editar departamentos</h3>}
      open={visible}
      footer={null}
      onCancel={onCancel}
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
          marginTop: 20
        }}
      >
        <Form.List
          name="names"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('At least 1 Department'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...formItemLayoutWithOutLabel}
                  label={index === 0 ? '' : ''}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
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
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
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

export default DepartmentModal;
