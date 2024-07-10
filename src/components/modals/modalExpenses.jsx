import React, { useState } from "react";
import { addExpenses } from "../../apiService/expensesApi";
import {
    Modal,
    Form,
    Input,
    Select,
    Space,
    Radio,
    message,
    Upload,
    Button,
} from "antd";
import { useAuth } from "../../contexts/authContext";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const ExpenseModal = ({ user, visible, onCancel, allAbsences, refresh }) => {
    const [form] = Form.useForm();
    const { userId, isHR } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false)

    const onCreate = async (values) => {
        const data = { ...values, expenseProof: fileList };
        console.log("data", data);
        try {
            setLoading(true)
            const response = await addExpenses(data);
            refresh((prev) => !prev);
            form.resetFields()
            setFileList([])
            onCancel();
            message.success('Se ha creado el gasto correctamente!')
        } catch (error) {
            message.error(error);
        } finally {
            setLoading(false)
        }
    };

    const handleAbsenceName = (value) => {
        form.setFieldsValue({ absenceId: value });
    };

    const props = {
        multiple: true,
        onChange({ file, fileList }) {
            if (file.status !== "uploading") {
                console.log("file: ", file, "fileList: ", fileList);
            }
            setFileList(fileList);
        },
        beforeUpload: () => false,
        fileList,
    };

    return (
        <>
            <Modal
                open={visible}
                title="Nuevo gasto de ausencia"
                okText="Ok"
                cancelText="Cancel"
                okButtonProps={{
                    loading,
                    autoFocus: true,
                    htmlType: "submit",
                    disabled: loading
                }}
                onCancel={onCancel}
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={form}
                        name="form_in_modal"
                        initialValues={{
                            modifier: "public",
                        }}
                        onFinish={onCreate}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item
                    name="absenceId"
                    label="Viaje"
                    rules={[
                        { required: true, message: "Selecciona una ausencia" },
                    ]}
                >
                    <Space wrap>
                        <Select
                            placeholder="Seleccionar..."
                            style={{
                                width: 400,
                            }}
                            onChange={handleAbsenceName}
                        >
                            {allAbsences?.map((ausencia) => (
                                <Option key={ausencia._id} value={ausencia._id}>
                                    {ausencia.absenceName}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                </Form.Item>
                <Form.Item
                    label="Método de pago"
                    name="paymentMethod"
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
                        <Radio value="Personal">Personal</Radio>
                        <Radio value="Business Card">Business Card</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="Método de pago"
                    name="paymentMethod"
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
                        <Radio value="Personal">Personal</Radio>
                        <Radio value="Business Card">Business Card</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    className="flex inline-row"
                    name="expenseTravel"
                    label="Traslados:"
                >
                    <Input placeholder="123" suffix="€" type="number" />
                </Form.Item>
                <Form.Item
                    className="flex inline-row"
                    name="expenseLodging"
                    label="Hospedajes:"
                >
                    <Input placeholder="123" suffix="€" type="number" />
                </Form.Item>
                <Form.Item
                    className="flex inline-row"
                    name="expenseFood"
                    label="Dietas:"
                >
                    <Input placeholder="123" suffix="€" type="number" />
                </Form.Item>
                <Form.Item
                    label="Justificantes: "
                    name="expenseProof"
                    rules={[
                        {
                            required: true,
                            message:
                                "Es necesario que selecciones al menos 1 archivo",
                        },
                    ]}
                >
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>
                            Selecciona el/los justificante/s
                        </Button>
                    </Upload>
                </Form.Item>
            </Modal>
        </>
    );
};

export default ExpenseModal;
