import React, { useEffect, useState } from 'react';
import { updateDepartment } from '../../apiService/departmentApi'; 
import { Modal, Button, Form, Input, message, Row, Col } from 'antd';

const BudgetModal = ({ visible, onCancel, departments, refresh }) => {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    if (visible && departments) {
      setBudgets(departments.map(dept => ({
        _id: dept._id,
        departmentName: dept.departmentName,
        departmentBudget: dept.departmentBudget || 0
      })));
    }
  }, [visible, departments]);

  const handleBudgetChange = (index, value) => {
    const newBudgets = [...budgets];
    newBudgets[index].departmentBudget = value;
    setBudgets(newBudgets);
  };

  const handleSave = async (department) => {
    try {
      await updateDepartment(department._id, { departmentBudget: department.departmentBudget });
      message.success("¡Presupuesto actualizado!");
      refresh();
    } catch (error) {
      message.error("No se pudo actualizar el presupuesto");
      console.error(error);
    }
  };

  return (
    <Modal
      title={<h3 style={{ fontSize: '20px' }}>Presupuestos Anuales por Departamento</h3>}
      visible={visible}
      footer={null}
      onCancel={onCancel}
      width={700}
    >
      <Form
        style={{
          maxWidth: 800,
          marginTop: 20,
        }}
      >
        {budgets.map((dept, index) => (
          <Form.Item key={dept._id} label={dept.departmentName}>
            <Row gutter={16}>
              <Col span={16}>
                <Input
                  type="number"
                  value={dept.departmentBudget}
                  onChange={(e) => handleBudgetChange(index, e.target.value)}
                  placeholder="Presupuesto anual"
                />
              </Col>
              <Col span={8}>
                <Button type="primary" onClick={() => handleSave(dept)}>
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default BudgetModal;