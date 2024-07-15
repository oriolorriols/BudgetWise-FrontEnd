import React, { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Space,
    DatePicker,
    message
} from "antd";
import { useAuth } from "../../contexts/authContext";
import TextArea from "antd/es/input/TextArea";
import { addAbsences, getOneAbsence, updateAbsences } from "../../apiService/absencesApi";
import dayjs from "dayjs";

dayjs().format()

const { Option } = Select;

const AbsenceModal = ({ visible, onCancel, allUsers, refresh, absence }) => {
    const [form] = Form.useForm();
    const { userId, isHR } = useAuth();
    const [initialValues, setInitialValues] = useState({})
    const [usuarioAEditar, setUsuarioAEditar] = useState([])

    useEffect(() => {
        usuario();
        console.log("absence useEffect modalAbsence", absence)
        if (absence) {
            getAbsenceData(absence)
        } else {
            form.resetFields()
            const formValues = {
                employeeId: allUsers?._id,
            }
            setInitialValues(formValues)
            form.setFieldsValue(formValues)
        }
    }, [absence, allUsers])

    const getAbsenceData = async (absence) => {
        const data = await getOneAbsence(absence)
        const formValues = {
            employeeId: data.employeeId,
            startDate: data.startDate,
            endDate: data.endDate,
            country: data.country,
            city: data.city,
            continent: data.continent,
            absenceName: data.absenceName,
            absenceService: data.absenceService,
            absenceCode: data.absenceCode ? data.absenceCode : null,
        }
        setInitialValues(formValues)
        form.setFieldsValue(formValues)
        console.log("data form values", data)
    }

    const createAbsence = async (values) => {
        try {
            if (absence) {
                console.log("Edita viaje, cierra modal, nuevos valores editados: ", values)
                await updateAbsences(absence, { ...values })
                message.success('Travel updated successfully!')
            } else {
                console.log("Crea viaje, cierra modal, valores a crear: ", values)
                const response = await addAbsences(values);
                message.success('Travel created successfully!')
            }
            refresh((prev) => !prev);
            form.resetFields();
            setInitialValues({});
            onCancel();
        } catch (error) {
            message.error(error)
            console.log("error", error)
        }
    }

    const handleAbsenceEmployee = (value) => {
        form.setFieldsValue({ employeeId: value });
    };

    const handleAbsenceContinent = (value) => {
        form.setFieldsValue({ continent: value });
    };

    const handleAbsenceService = (value) => {
        form.setFieldsValue({ absenceService: value });
    };

    const onDateChangeAbsenceStart = (date, dateStrings) => {
        const newDate = new Date(dateStrings)
        form.setFieldsValue({ startDate: dateStrings });
    };
    const onDateChangeAbsenceEnd = (date, dateStrings) => {
        const newDate = new Date(dateStrings)
        form.setFieldsValue({ endDate: dateStrings });
    };

    const usuario = () => {
        if (isHR === "HR") {
            const usuario = allUsers?.filter(usuario => usuario._id === initialValues?.employeeId)[0]
            setUsuarioAEditar(usuario)
        }
    }

    return (
        <>
            <Modal
                open={visible}
                title={absence ? "Editar viaje:" : "Crear nuevo viaje"}
                okText="Ok"
                cancelText="Cancel"
                okButtonProps={{
                    autoFocus: true,
                    htmlType: "submit",
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
                    <Select
                        placeholder={
                            (absence && isHR === "HR") ? usuarioAEditar?.name + " " + usuarioAEditar?.surname : "Seleccionar..." &&
                                (absence && isHR !== "HR") ? allUsers?.name + " " + allUsers?.surname : "Seleccionar..."
                        }
                        style={{
                            width: 300,
                        }}
                        onChange={handleAbsenceEmployee}
                    >
                        {isHR === "HR" ?
                            allUsers?.map((user) => (
                                <Option key={user._id} value={user._id}>
                                    {user.name} {user.surname}
                                </Option>
                            )) :
                            <Option key={allUsers?._id} value={allUsers?._id} defaultValue={allUsers?._id}>
                                {allUsers?.name} {allUsers?.surname}
                            </Option>
                        }
                    </Select>
                </Form.Item>
                <Space>
                    <Form.Item
                        name="startDate"
                        label="Fecha de inicio"
                        getValueProps={(value) => ({ value: value ? dayjs(value) : "", })}
                        rules={[
                            { required: true, message: "Selecciona una fecha" },
                        ]}
                    >
                        <DatePicker onChange={onDateChangeAbsenceStart} />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label="Fecha de fin"
                        getValueProps={(value) => ({ value: value ? dayjs(value) : "", })}
                        rules={[
                            { required: true, message: "Selecciona una fecha" },
                        ]}
                    >
                        <DatePicker onChange={onDateChangeAbsenceEnd} />
                    </Form.Item>
                </Space>
                <Space>
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
                        <Select
                            defaultValue={initialValues?.continent}
                            placeholder={absence ? initialValues.continent : "Seleccionar..."}
                            style={{
                                width: 150,
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
                    </Form.Item>
                </Space>
                <Space>
                    <Form.Item
                        name="absenceService"
                        label="Servicio"
                        rules={[
                            { required: true, message: "Selecciona un servicio" },
                        ]}
                    >
                        <Select
                            defaultValue={initialValues?.absenceService}
                            placeholder={absence ? initialValues.absenceService : "Selecionar..."}
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
                    </Form.Item>
                    <Form.Item
                        className="flex inline-row"
                        name="absenceCode"
                        label="Código de venta (si aplica):"
                    >
                        <Input placeholder="PV-0080" />
                    </Form.Item>
                </Space>
            </Modal >
        </>
    );
};

export default AbsenceModal;
