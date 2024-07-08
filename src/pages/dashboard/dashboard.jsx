import React, { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/authContext";
import { getOneUser } from '../../apiService/userApi';
import { getExpenses } from '../../apiService/expensesApi';
import { Row, Col, DatePicker, Select, Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

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
      <div>
        <h2 className='font-medium text-2xl'>Hola, {user?.name}!</h2>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <div className="flex">
              <img src="https://cdn-icons-png.flaticon.com/512/482/482541.png" width="50px" alt="Expenses Icon" />
              <div className='ml-3'>
                <h3>Gastos</h3>
                <p className='font-bold'>1.388,25€</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div className="flex">
              <img src="https://cdn-icons-png.flaticon.com/512/482/482541.png" width="50px" alt="Accumulated Icon" />
              <div className='ml-3'>
                <h3>Acumulado año</h3>
                <p className='font-bold'>3.388,25€</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div className="flex">
              <img src="https://cdn-icons-png.flaticon.com/512/482/482541.png" width="50px" alt="Average Monthly Icon" />
              <div className='ml-3'>
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
