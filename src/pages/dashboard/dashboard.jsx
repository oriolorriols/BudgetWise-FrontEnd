import React, { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/authContext";
import { getOneUser } from '../../apiService/userApi';
import { getExpenses } from '../../apiService/expensesApi';
import { Row, Col, DatePicker, Select, Card, Flex } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import './dashboard.scss';
import ProfileBar from '../../components/profileBar/profileBar';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [expenseType, setExpenseType] = useState(null);

  const getUserData = async () => {
    try {
      const data = await getOneUser(userId);
      setUser(data);
      const expensesData = await getExpenses(userId); 
      setExpenses(expensesData);
      setFilteredExpenses(expensesData);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [userId]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    filterExpenses(dates, expenseType);
  };

  const handleTypeChange = (value) => {
    setExpenseType(value);
    filterExpenses(dateRange, value);
  };

  const filterExpenses = (dates, type) => {
    let filtered = expenses;
    if (dates && dates[0] && dates[1]) {
      filtered = filtered.filter(expense => 
        moment(expense.createdAt).isBetween(dates[0], dates[1])
      );
    }
    if (type) {
      filtered = filtered.filter(expense => expense.paymentMethod === type);
    }
    setFilteredExpenses(filtered);
  };

  const getPieChartOptions = () => {
    const categories = [...new Set(filteredExpenses.map(expense => expense.paymentMethod))];
    const seriesData = categories.map(category => {
      const total = filteredExpenses
        .filter(expense => expense.paymentMethod === category)
        .reduce((acc, expense) => acc + (expense.amount || 0), 0);
      return {
        name: category,
        value: total
      };
    });

    return {
      title: {
        text: 'General',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'bottom'
      },
      series: [
        {
          name: 'Gastos',
          type: 'pie',
          radius: '50%',
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  const getLineChartOptions = () => {
    const dates = filteredExpenses.map(expense => moment(expense.createdAt).format('YYYY-MM-DD'));
    const uniqueDates = [...new Set(dates)];
    const totalExpensesByDate = uniqueDates.map(date => {
      return {
        date,
        total: filteredExpenses
          .filter(expense => moment(expense.createdAt).format('YYYY-MM-DD') === date)
          .reduce((acc, expense) => acc + (expense.amount || 0), 0)
      };
    });

    return {
      title: {
        text: 'Gastos en el tiempo',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: totalExpensesByDate.map(data => data.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: totalExpensesByDate.map(data => data.total),
          type: 'line',
          smooth: true
        }
      ]
    };
  };

  const getBarChartOptions = () => {
    const categories = ['Food', 'Travel', 'Lodging'];
    const seriesData = categories.map(category => {
      return {
        name: category,
        type: 'bar',
        stack: 'total',
        data: filteredExpenses.map(expense => expense[`expense${category}`] || 0)
      };
    });

    return {
      title: {
        text: 'Gastos por categoría',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        top: 'bottom'
      },
      xAxis: {
        type: 'category',
        data: filteredExpenses.map(expense => moment(expense.createdAt).format('YYYY-MM-DD'))
      },
      yAxis: {
        type: 'value'
      },
      series: seriesData
    };
  };

  const twoColors = {
    '0%': '#108ee9',
    '100%': '#87d068',
  };

  return (
    <>      
      <Flex wrap justify="space-between" align="flex-start">
        <div className="title-box">
          <h1 className='title'>¡Bienvenido de nuevo, {user?.name}!</h1>
          <h2 className='subtitle'>Aquí puedes ver el resumen y toda la información sobre tus gastos</h2>
        </div>        
        <ProfileBar />
      </Flex>

      <Row gutter={16}>
        <Col span={8}>
          <Card className={"card-expenses total-expenses"}>
            <div className="flex">
              <div className="icon-expenses">
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 20q-1.65 0-2.825-1.175T2 16V8q0-1.65 1.175-2.825T6 4h12q1.65 0 2.825 1.175T22 8v8q0 1.65-1.175 2.825T18 20zM6 8h12q.55 0 1.05.125t.95.4V8q0-.825-.587-1.412T18 6H6q-.825 0-1.412.588T4 8v.525q.45-.275.95-.4T6 8m-1.85 3.25l11.125 2.7q.225.05.45 0t.425-.2l3.475-2.9q-.275-.375-.7-.612T18 10H6q-.65 0-1.137.338t-.713.912"></path>
                </svg>
              </div>
              <div className='ml-5'>
                <h3>Gastos</h3>
                <p className='font-bold'>1.388,25€</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className={"card-expenses accumulated-expense"}>
            <div className="flex">
              <div className="icon-expenses">
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 7v2h-2V7zm-4 0v2H7V7zm0 4H7v2h6zm2 0v2h2v-2zm6 11l-3-2l-3 2l-3-2l-3 2l-3-2l-3 2V3h18zm-2-3.74V5H5v13.26l1-.66l3 2l3-2l3 2l3-2z"></path>
                </svg>
              </div>
              <div className='ml-5'>
                <h3>Acumulado año</h3>
                <p className='font-bold'>3.388,25€</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className={"card-expenses average-expenses"}>
            <div className="flex">
              <div className="icon-expenses">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.5 23.5 0 0 0-3.609 3.056a.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25 25 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92" clipRule="evenodd"/>
                </svg>
              </div>
              <div className='ml-5'>
                <h3>Gasto medio mes</h3>
                <p className='font-bold'>503€</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>


      <div style={{ margin: '20px 0' }}>
        <RangePicker onChange={handleDateChange} />
        <Select style={{ width: 120, marginLeft: '10px' }} onChange={handleTypeChange} placeholder="Tipo de gasto">
          <Option value="Personal">Personal</Option>
          <Option value="Business Card">Business Card</Option>
        </Select>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="General">
            <ReactEcharts option={getPieChartOptions()} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Gastos en el tiempo">
            <ReactEcharts option={getLineChartOptions()} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Gastos por categoría">
            <ReactEcharts option={getBarChartOptions()} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;