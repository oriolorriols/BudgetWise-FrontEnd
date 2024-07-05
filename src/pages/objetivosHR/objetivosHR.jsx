import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, notification, Progress, Popconfirm } from 'antd';
import { getDepartments } from '../../apiService/departmentApi';
import { getUsers } from '../../apiService/userApi';
import { getGoals, addGoalForDepartment, deleteGoal } from '../../apiService/goalApi';
const { Option } = Select;

const ObjetivosHR = () => {
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [goals, setGoals] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchDepartments = async () => {
            const departments = await getDepartments();
            setDepartments(departments);
        };

        const fetchUsers = async () => {
            const users = await getUsers();
            setUsers(users);
        };

        const fetchGoals = async () => {
            const goals = await getGoals();
            setGoals(goals);
        };

        fetchDepartments();
        fetchUsers();
        fetchGoals();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const onFinish = async (values) => {
        try {
            await addGoalForDepartment(values);
            notification.success({ message: 'Objetivo creado para todo el departamento' });
            setIsModalVisible(false);
            form.resetFields();
            // Refresh goals list
            const goals = await getGoals();
            setGoals(goals);
        } catch (error) {
            notification.error({ message: 'Error al crear objetivo' });
        }
    };

    const getCompletionPercentage = (userId) => {
        console.log(goals);
        const userGoals = goals.filter(goal => goal.employeeId._id === userId);
        const completedGoals = userGoals.filter(goal => goal.goalStatus === 'Completado');
        return userGoals.length > 0 ? ((completedGoals.length / userGoals.length) * 100).toFixed(0) : 0;
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            await deleteGoal(goalId);
            notification.success({ message: 'Objetivo eliminado' });
            const goals = await getGoals();
            setGoals(goals);
        } catch (error) {
            notification.error({ message: 'Error al eliminar objetivo' });
        }
    };

    const expandedRowRender = (department) => {
        console.log(department)
        console.log(users)
        const departmentUsers = users.filter(user => user.departmentId._id === department._id);
        const columns = [
            { title: 'Empleado', dataIndex: 'name', key: 'name' },
            { 
                title: 'Progreso de Objetivos', 
                key: 'progress',
                render: (_, user) => (
                    <Progress percent={getCompletionPercentage(user._id)} />
                )
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={departmentUsers}
                rowKey="_id"
                pagination={false}
            />
        );
    };

    const getDepartmentGoals = (departmentId) => {
        const departmentGoals = goals.filter(goal => goal.employeeId.departmentId === departmentId);
        const columns = [
            { title: 'Objetivo', dataIndex: 'goalName', key: 'goalName' },
            {
                title: 'Acción',
                key: 'action',
                render: (_, goal) => (
                    <Popconfirm
                        title="¿Seguro que deseas eliminar este objetivo?"
                        onConfirm={() => handleDeleteGoal(goal._id)}
                    >
                        <Button type="link">Eliminar</Button>
                    </Popconfirm>
                ),
            }
        ];

        return (
            <Table
                columns={columns}
                dataSource={departmentGoals}
                rowKey="_id"
                pagination={false}
            />
        );
    };

    const columns = [
        { title: 'Nombre del Departamento', dataIndex: 'departmentName', key: 'departmentName' },
    ];

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Añadir Objetivo para Departamento
            </Button>
            <Table
                columns={columns}
                dataSource={departments}
                rowKey="_id"
                expandable={{
                    expandedRowRender: record => (
                        <>
                            {getDepartmentGoals(record._id)}
                            {expandedRowRender(record)}
                        </>
                    ),
                }}
            />

            <Modal
                title="Añadir Objetivo para Departamento"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={onFinish}>
                    <Form.Item name="departmentId" label="Departamento" rules={[{ required: true, message: 'Seleccione un departamento' }]}>
                        <Select placeholder="Seleccione un departamento">
                            {departments.map(dept => (
                                <Option key={dept._id} value={dept._id}>{dept.departmentName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="goalName" label="Nombre del Objetivo" rules={[{ required: true, message: 'Ingrese el nombre del objetivo' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="goalDescription" label="Descripción del Objetivo">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Crear Objetivo</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ObjetivosHR;
