import React, { useState } from "react";
import { addExpenses } from "../../apiService/expensesApi";
import {
    Modal,
    Button,
    Form,
    Input,
    Select,
    Space,
    DatePicker,
    Radio,
} from "antd";

const { Option } = Select;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const ExpenseModal = ({ user, visible, onCancel }) => {
    const [form] = Form.useForm();

    const onFinishData = async (values) => {
        console.log(values);
        //const response = await addExpenses(values)
    };

    const [title, setTitle] = useState("");

    const handleTitle = () => {
        setTitle();
    };

    return (
        <Modal
            open={visible}
            title="Nuevo gasto de ausencia"
            okText="Ok"
            cancelText="Cancel"
            okButtonProps={{
                autoFocus: true,
                htmlType: "submit",
            }}
            onCancel={onCancel}
            destroyOnClose
            modalRender={(dom) => (
                <Form
                    layout="vertical"
                    form={form}
                    name="form_in_modal"
                    initialValues={{
                        modifier: "public",
                    }}
                    clearOnDestroy
                    onFinish={(values) => onCreate(values)}
                >
                    {dom}
                </Form>
            )}
        >
            <Form.Item
                name="title"
                label="Ausencia"
                rules={[
                    {
                        required: true,
                        message: "Es necesario que escribas un título",
                    },
                ]}
            >
                <Space wrap>
                    <Select
                        defaultValue="Título"
                        style={{
                            width: 120,
                        }}
                        onChange={handleTitle}
                        options={[
                            {
                                value: "jack",
                                label: "Jack",
                            },
                            {
                                value: "lucy",
                                label: "Lucy",
                            },
                            {
                                value: "Yiminghe",
                                label: "yiminghe",
                            },
                            {
                                value: "disabled",
                                label: "Disabled",
                                disabled: true,
                            },
                        ]}
                    />
                </Space>
            </Form.Item>
            <Form.Item
                label="Método de pago"
                name="modifier"
                className="collection-create-form_last-form-item"
                rules={[
                    {
                        required: true,
                        message:
                            "Es necesario que selecciones un método de pago",
                    },
                ]}
            >
                <Radio.Group>
                    <Radio value="public">Personal</Radio>
                    <Radio value="private">Business Card</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                name="description"
                label="Últimos 4 dígitos de la tarjeta de empresa (si aplica)"
            >
                <Input placeholder="1010" addonBefore="*" />
            </Form.Item>
            <Form.Item className="flex inline-row" name="description">
                <p>Traslados</p> <Input placeholder="123" suffix="€" />
                <p>Hospedajes</p> <Input placeholder="123" suffix="€" />
                <p>Dietas</p> <Input placeholder="123" suffix="€" />
            </Form.Item>
        </Modal>

        // <Modal
        //   title={<h3 style={{ fontSize: '20px' }}> Añadir un gasto</h3>}
        //   open={visible}
        //   footer={null}
        //   onCancel={onCancel}
        //   width={700}
        // >
        //   <div className='flex mt-5'>
        //     <Form form={form} name='validate_other' {...formItemLayout} onFinish={onFinishData} style={{ width: 700 }}>
        //     <Form.Item rules={[{ required: true, message: 'Introduce tus apellidos!' }]} label='expenseDate' name='expenseDate'>
        //         <DatePicker format={dateFormat} />
        //       </Form.Item>
        //       <Form.Item className='w-full' name='paymentMethod' label='paymentMethod' rules={[{ required: true, message: 'Introduce tus apellidos!' }]}>
        //       <Select>
        //         <Option value="Personal">
        //           Personal
        //         </Option>
        //         <Option value="Business Card">
        //           Business Card
        //         </Option>

        //         </Select>
        //       </Form.Item>
        //       <Form.Item className='w-full' name='expenseTraslados' label='Traslados' rules={[{ required: true, message: 'Introduce tu DNI!' }]}>
        //           <Input type='number' suffix="€" />
        //       </Form.Item>
        //       <Form.Item className='w-full' name='expenseDietas' label='Dietas' rules={[{ message: 'Introduce tu posición!' }]}>
        //         <Input type='number' suffix="€" />
        //       </Form.Item>
        //       <Form.Item className='w-full' name='expenseHospedajes' label='Hospedajes' rules={[{ required: true, message: 'Selecciona un departamento' }]}>
        //         <Input type='number' suffix="€" />
        //       </Form.Item>

        //       <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        //         <Space>
        //           <Button type='primary' htmlType='submit'>
        //             Añadir
        //           </Button>
        //         </Space>
        //       </Form.Item>
        //     </Form>
        //   </div>
        // </Modal>
    );
};

export default ExpenseModal;
