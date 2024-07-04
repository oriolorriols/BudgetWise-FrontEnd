import React, { useEffect, useState } from "react";
import { addExpenses } from "../../apiService/expensesApi";
import { Modal, Form, Input, Select, Space, Radio, message } from "antd";
import { useAuth } from "../../contexts/authContext";
import { getAbsences } from "../../apiService/absencesApi";

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
    const { userId, isHR } = useAuth();

    const onCreate = async (values) => {
        console.log(values);
        //const response = await addExpenses(values)
    };

    const [error, setError] = useState("");
    const [allAbsences, setAllAbsences] = useState([]);
    const [title, setTitle] = useState("");
    const [dummy, refresh] = useState(false);

    const handleTitle = () => {
        setTitle();
    };

    const getAllAbsences = async () => {
        const absences = await getAbsences();
        const notRemoved = absences.filter((absence) => !absence.removeAt);
        if (absences.length) setAllAbsences(notRemoved);
        else setError(absences.message);
    };

    useEffect(() => {
        getAllAbsences();
    }, [dummy]);

    return (
        <>
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
                <Form.Item name="absenceName" label="Ausencia">
                    <Space wrap>
                        <Select
                            defaultValue="Seleccionar..."
                            style={{
                                width: 400,
                            }}
                            onChange={handleTitle}
                            options={allAbsences.map((ausencia) => ({
                                label: ausencia.absenceCodeId.absenceName,
                                value: ausencia.absenceCodeId.absenceName,
                            }))}
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
                    <Radio.Group name="Prueba">
                        <Radio value="Personal">Personal</Radio>
                        <Radio value="Business Card">Business Card</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="TDC"
                    label="Últimos 4 dígitos de la tarjeta de empresa (si aplica)"
                >
                    <Input placeholder="1010" addonBefore="*" />
                </Form.Item>
                <Form.Item className="flex inline-row" name="Desglose">
                    <p>Traslados</p> <Input placeholder="123" suffix="€" />
                    <p>Hospedajes</p> <Input placeholder="123" suffix="€" />
                    <p>Dietas</p> <Input placeholder="123" suffix="€" />
                </Form.Item>
            </Modal>
        </>
    );
};

export default ExpenseModal;
