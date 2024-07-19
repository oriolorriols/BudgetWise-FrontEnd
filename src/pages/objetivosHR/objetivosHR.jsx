import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, notification, Progress, Popconfirm, Flex } from 'antd';
import { getDepartments } from '../../apiService/departmentApi';
import { getUsers } from '../../apiService/userApi';
import { getGoals, addGoalForDepartment, deleteGoal, updateGoal } from '../../apiService/goalApi';
import './objetivosHR.scss';
const { Option } = Select;

const ObjetivosHR = () => {
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [goals, setGoals] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [loading, setLoading] = useState(true);
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
            setLoading(true)
            const goals = await getGoals();
            setGoals(goals);
            setLoading(false)
        };

        fetchDepartments();
        fetchUsers();
        fetchGoals();
    }, []);

    const showModal = () => {
        setIsEditMode(false);
        setIsModalVisible(true);
    };

    const showEditModal = (goal) => {
        setIsEditMode(true);
        setEditingGoal(goal);
        form.setFieldsValue({
            departmentId: goal.employeeId.departmentId,
            goalName: goal.goalName,
            goalDescription: goal.goalDescription
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingGoal(null);
    };

    const onFinish = async (values) => {
        if (isEditMode) {
            try {
                await updateGoal(editingGoal._id, values);
                notification.success({ message: 'Objetivo actualizado correctamente' });
                setIsModalVisible(false);
                form.resetFields();
                setEditingGoal(null);
                // Refresh goals list
                const goals = await getGoals();
                setGoals(goals);
            } catch (error) {
                notification.error({ message: 'Error al actualizar objetivo' });
            }
        } else {
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
        }
    };

    const getCompletionPercentage = (userId) => {
        const userGoals = goals.filter(goal => goal.employeeId?._id === userId);
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

    const removeDuplicateGoals = (departmentId) => {
        const departmentGoals = goals.filter(goal => goal.employeeId?.departmentId === departmentId);
        const uniqueGoals = [];
        const goalMap = {};

        departmentGoals.forEach(goal => {
            const key = `${goal.goalName}-${goal.goalDescription}`;
            if (!goalMap[key]) {
                goalMap[key] = true;
                uniqueGoals.push(goal);
            }
        });

        return uniqueGoals;
    };

    const expandedRowRender = (department) => {
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
        const uniqueGoals = removeDuplicateGoals(departmentId);
        const columns = [
            { title: 'Objetivo', dataIndex: 'goalName', key: 'goalName' },
            {
                title: 'Acción',
                key: 'action',
                render: (_, goal) => (
                    <>
                        <Button type="link" onClick={() => showEditModal(goal)}>Editar</Button>
                        <Popconfirm
                            title="¿Seguro que deseas eliminar este objetivo?"
                            onConfirm={() => handleDeleteGoal(goal._id)}
                        >
                            <Button type="link">Eliminar</Button>
                        </Popconfirm>
                    </>
                ),
            }
        ];

        return (
            <Table
                columns={columns}
                dataSource={uniqueGoals}
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
            <Flex wrap justify="space-between" align="flex-start">
                <div className="title-box">
                    <h1 className='title'>Objetivos</h1>
                    <h2 className='subtitle'>Consulta todos los objetivos marcados de cada departamente para este trimestre</h2>
                </div>
                <div className="flex justify-end my-5">                    
                    <Button type="primary" onClick={showModal}>
                        Añadir Objetivo para Departamento
                    </Button>
                </div>
            </Flex>
            <div className="tabla-objetivos">
                <Table
                    columns={columns}
                    dataSource={departments}
                    rowKey="_id"
                    loading={loading}
                    expandable={{
                        expandedRowRender: record => (
                            <>
                                {getDepartmentGoals(record._id)}
                                {expandedRowRender(record)}
                            </>
                        ),
                    }}
                />
            </div>
            <Modal
                title={isEditMode ? "Editar Objetivo" : "Añadir Objetivo para Departamento"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={onFinish}>
                    <Form.Item name="departmentId" label="Departamento" rules={[{ required: true, message: 'Seleccione un departamento' }]}>
                        <Select placeholder="Seleccione un departamento" disabled={isEditMode}>
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
                        <Button type="primary" htmlType="submit">
                            {isEditMode ? "Actualizar Objetivo" : "Crear Objetivo"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ObjetivosHR;
