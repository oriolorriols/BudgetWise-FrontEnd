import React, { useState } from "react";

import {
    Modal,
    Form,
    Input,
    Select,
    Space,
    DatePicker
} from "antd";
import { useAuth } from "../../contexts/authContext";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";

const { RangePicker } = DatePicker;
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const AbsenceModal = ({ user, visible, onCancel, allUsers, refresh }) => {
    const [form] = Form.useForm();
    const { userId, isHR } = useAuth();
    const [dates, setDates] = useState([]);

    const createAbsence = (values) => {
        console.log("Crea viaje, cierra modal", values)
        onCancel();
    }
    //         const response = await addExpenses(values);
    //         refresh((prev) => !prev);
    //         onCancel();
    //     } catch (error) {
    //         message.error(error);
    //     }

    const handleAbsenceEmployee = (value) => {
        form.setFieldsValue({ employeeId: value });
        console.log("44 empleado", value)
    };

    const handleAbsenceContinent = (value) => {
        form.setFieldsValue({ continent: value });
        console.log("49 continente", value)
    };

    const handleAbsenceService = (value) => {
        form.setFieldsValue({ absenceService: value });
        console.log("55 servicio", value)
    };

    const onDateChangeAbsence = (dates, dateStrings) => {
        setDates(dateStrings);
        filterDataByDate(dateStrings);
    };

    const filterDataByDate = (dateStrings) => {
        const [start, end] = dateStrings;
        form.setFieldsValue({ startDate: start, endDate: end });
        console.log("67 fechas", "inicio", start, "final", end)
    };

    return (
        <>
            <Modal
                open={visible}
                title="Crear nuevo viaje"
                okText="Ok"
                cancelText="Cancel"
                okButtonProps={{
                    autoFocus: true,
                    htmlType: "submit",
                }}
                onCancel={onCancel}
                //destroyOnClose
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={form}
                        name="form_in_modal"
                        initialValues={{
                            modifier: "public",
                        }}
                        //clearOnDestroy
                        onFinish={(values) => createAbsence(values)}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item
                    className="flex inline-row"
                    name="absenceName"
                    label="Título:"
                    rules={[
                        { required: true, message: "Escibe un título del viaje" },
                    ]}
                >
                    <TextArea
                        placeholder="Servicio, pais/ciudad, y código de venta"
                        style={{
                            width: 400,
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="employeeId"
                    label="Empleado"
                    rules={[
                        { required: true, message: "Selecciona un empleado" },
                    ]}
                >
                    <Space wrap>
                        <Select
                            placeholder="Seleccionar..."
                            style={{
                                width: 300,
                            }}
                            onChange={handleAbsenceEmployee}
                        >
                            {allUsers?.map((user) => (
                                <Option key={user._id} value={user._id}>
                                    {user.name} {user.surname}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                </Form.Item>
                <Form.Item
                    //name="RangePicker"
                    label="Fecha de inicio y fin del viaje"
                    rules={[
                        {
                            required: true,
                            message: "Selecciona un rango",
                        },
                    ]}>
                    <RangePicker onChange={onDateChangeAbsence} />
                </Form.Item>
                <Form.Item
                    name="country"
                    label="País de visita:"
                    rules={[
                        { required: true, message: "Escribe un país" },
                    ]}
                >
                    <Input
                        placeholder="España"
                        style={{
                            width: 150,
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="city"
                    label="Ciudad de visita:"
                    rules={[
                        { required: true, message: "Escribe una ciudad" },
                    ]}
                >
                    <Input
                        placeholder="Madrid"
                        style={{
                            width: 150,
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="continent"
                    label="Continente"
                    rules={[
                        { required: true, message: "Selecciona un continente" },
                    ]}
                >
                    <Space wrap>
                        <Select
                            placeholder="Seleccionar..."
                            style={{
                                width: 200,
                            }}
                            onChange={handleAbsenceContinent}
                            options={[
                                { value: 'America', label: 'America' },
                                { value: 'Europa', label: 'Europa' },
                                { value: 'Africa', label: 'Africa' },
                                { value: 'Asia', label: 'Asia' },
                                { value: 'Oceania', label: 'Oceania' },
                            ]}
                        />
                    </Space>
                </Form.Item>
                <Form.Item
                    name="absenceService"
                    label="Servicio"
                    rules={[
                        { required: true, message: "Selecciona un servicio" },
                    ]}
                >
                    <Space wrap>
                        <Select
                            placeholder="Seleccionar..."
                            style={{
                                width: 200,
                            }}
                            onChange={handleAbsenceService}
                            options={[
                                { value: 'Demo', label: 'Demo' },
                                { value: 'Venta', label: 'Venta' },
                                { value: 'Post-Venta', label: 'Post-Venta' },
                                { value: 'Soporte', label: 'Soporte' },
                                { value: 'Formacion', label: 'Formacion' },
                                { value: 'Feria', label: 'Feria' },
                                { value: 'Otros', label: 'Otros' },
                            ]}
                        />
                    </Space>
                </Form.Item>
                <Form.Item
                    className="flex inline-row"
                    name="absenceCode"
                    label="Código de venta (si aplica):"
                >
                    <Input placeholder="PV-0080" />
                </Form.Item>
            </Modal>
        </>
    );
};

export default AbsenceModal;
