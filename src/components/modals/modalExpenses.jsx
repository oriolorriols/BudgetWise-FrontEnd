import React, { useState, useEffect } from "react";
import { addExpenses, updateExpenses } from "../../apiService/expensesApi";
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
    List,
} from "antd";
import { useAuth } from "../../contexts/authContext";
import { UploadOutlined, LinkOutlined, CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

const ExpenseModal = ({ expense, visible, onCancel, allAbsences, refresh }) => {
    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState({});
    const { userId, isHR } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (expense) {
            getExpense(expense);
            console.log(expense)
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [expense]);

    const getExpense = async (data) => {
        const formValues = {
            absenceId: data.absenceId?._id,
            paymentMethod: data.paymentMethod,
            creditCardEnd: data.creditCardEnd,
            expenseTravel: data.expenseTravel,
            expenseLodging: data.expenseLodging,
            expenseFood: data.expenseFood,
        };
        setInitialValues(formValues);
        form.setFieldsValue(formValues);
        setFileList(data.expenseProof.map((proof, index) => ({
            uid: index,
            name: `Justificante ${index + 1}`,
            url: proof,
        })));
    };

    const onFinishData = async (values) => {
        const data = { ...values, expenseProof: fileList.map(file => file.url || file.originFileObj) };
        console.log("data", data);
        try {
            setLoading(true);
            if (expense) {
                 if (fileList.length > 0) {
                    data.expenseProof = fileList.map(file => file.url || file.originFileObj);
                }
                const response = await updateExpenses(expense._id, data);
                message.success('Se ha actualizado el gasto correctamente!');
            } else {
                const response = await addExpenses(data);
                message.success('Se ha creado el gasto correctamente!');
            }
            refresh(prev => !prev);
            form.resetFields();
            setFileList([]);
            onCancel();
        } catch (error) {
            message.error(error.message || 'Error al guardar el gasto');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFile = (file) => {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
    };

    const props = {
        if(expense){
            setFileList(null)
        },
        multiple: true,
        onChange({ file, fileList }) {
            setFileList(fileList);
        },
        beforeUpload: () => false,
        fileList,
    };

    return (
        <Modal
            open={visible}
            title={expense ? "Editar gasto de ausencia" : "Nuevo gasto de ausencia"}
            okText={expense ? "Actualizar" : "Crear"}
            cancelText="Cancelar"
            okButtonProps={{
                loading,
                autoFocus: true,
                htmlType: "submit",
                disabled: loading,
            }}
            onCancel={onCancel}
            destroyOnClose={true}
            maskClosable={false}
            footer={null}
        >
            <Form
                layout="vertical"
                form={form}
                name="form_in_modal"
                initialValues={{ modifier: "public" }}
                onFinish={onFinishData}
            >
                <Form.Item
                    name="absenceId"
                    label="Viaje"
                    rules={[{ required: true, message: "Selecciona una ausencia" }]}
                >
                    <Select
                        placeholder="Seleccionar..."
                        style={{ width: 400 }}
                    >
                        {allAbsences?.map((ausencia) => (
                            <Option key={ausencia._id} value={ausencia._id}>
                                {ausencia.absenceName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Método de pago"
                    name="paymentMethod"
                    className="collection-create-form_last-form-item"
                    rules={[{ required: true, message: "Es necesario que selecciones un método de pago" }]}
                >
                    <Radio.Group>
                        <Radio value="Personal">Personal</Radio>
                        <Radio value="Business Card">Business Card</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="creditCardEnd"
                    label="Últimos 4 dígitos de la tarjeta de empresa (si aplica):"
                >
                    <Input
                        placeholder="1010"
                        addonBefore="*"
                        style={{ width: 200 }}
                    />
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
                    rules={[{ required: !expense, message: "Es necesario que selecciones al menos 1 archivo" }]}
                >
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>
                            Selecciona el/los justificante/s
                        </Button>
                    </Upload>
                    {expense ? 
                        <List
                        style={{ marginTop: 10 }}
                        size="small"
                        bordered
                        dataSource={fileList}
                        renderItem={file => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="link"
                                        icon={<LinkOutlined />}
                                        target="_blank"
                                        href={file.url}
                                    >
                                        Ver enlace
                                    </Button>,
                                    <Button
                                        type="link"
                                        danger
                                        icon={<CloseOutlined />}
                                        onClick={() => handleRemoveFile(file)}
                                    >
                                        Eliminar
                                    </Button>,
                                ]}
                            >
                                {file.name}
                            </List.Item>
                        )}
                    /> : null
                
                
                }
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button onClick={onCancel}>Cancelar</Button>
                        <Button type="primary" loading={loading} htmlType="submit">
                            {expense ? "Actualizar" : "Crear"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ExpenseModal;
