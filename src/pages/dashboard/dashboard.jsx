import React, { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/authContext";
import { getOneUser } from '../../apiService/userApi';
import TokenModal from '../../components/modals/modalToken';
import { Progress, Card, Col, Row, Statistic } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';

const Dashboard = () => {
  const { userId } = useAuth();
  const [isModalTokenVisible, setIsModalTokenVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const getUserData = async () => {
    try {
      const data = await getOneUser(userId);
      setUser(data);
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true);
      } 
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  const getExpensesData = async () => {
    // Aquí deberías hacer una llamada al API para obtener los datos de los gastos
    const data = [
      { month: 'Enero', expense: 400 },
      { month: 'Febrero', expense: 300 },
      { month: 'Marzo', expense: 200 },
      { month: 'Abril', expense: 278 },
      { month: 'Mayo', expense: 189 },
      { month: 'Junio', expense: 239 },
      { month: 'Julio', expense: 349 },
      { month: 'Agosto', expense: 450 },
      { month: 'Septiembre', expense: 320 },
      { month: 'Octubre', expense: 210 },
      { month: 'Noviembre', expense: 310 },
      { month: 'Diciembre', expense: 200 }
    ];
    setExpenses(data);
  };

  useEffect(() => {
    getUserData();
    getExpensesData();
  }, [userId]);

  const twoColors = {
    '0%': '#108ee9',
    '100%': '#87d068',
  };

  const config = {
    data: expenses,
    xField: 'month',
    yField: 'expense',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  return (
    <>
      <TokenModal visible={isModalTokenVisible} />
      <div>
        <h2 className='font-medium text-2xl'>Hola, {user?.name}!</h2>
      </div>

      <div className='flex'>
        <div className="flex bg-cyan-950 text-white w-fit rounded-lg px-5 py-4 m-3"> 
          <img src="https://cdn-icons-png.flaticon.com/512/482/482541.png" width="50px" alt="" />
          <div className='ml-3'>
            <h3>Gastos</h3>
            <p className='font-bold'>1.388,25€</p>
          </div>
        </div>

        <div className="flex bg-cyan-950 text-white w-fit rounded-lg px-5 py-4 m-3"> 
          <img src="https://cdn-icons-png.flaticon.com/512/482/482541.png" width="50px" alt="" />
          <div className='ml-3'>
            <h3>Acumulado año</h3>
            <p className='font-bold'>3.388,25€</p>
          </div>
        </div>

        <div className="flex bg-cyan-950 text-white w-fit rounded-lg px-5 py-4 m-3"> 
          <img src="https://cdn-icons-png.flaticon.com/512/482/482541.png" width="50px" alt="" />
          <div className='ml-3'>
            <h3>Gasto medio mes</h3>
            <p className='font-bold'>503€</p>
          </div>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{
                color: '#3f8600',
              }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{
                color: '#cf1322',
              }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card bordered={false}>
            <h3>Gastos Mensuales</h3>
            <Line {...config} />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '20px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Progress type="dashboard" percent={90} strokeColor={twoColors} />
          </Col>
          <Col span={12}>
            <Progress type="dashboard" percent={100} strokeColor={twoColors} />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
