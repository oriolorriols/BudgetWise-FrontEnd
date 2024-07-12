import React, { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/authContext";
import { getOneUser } from '../../apiService/userApi';
import { getExpenses } from '../../apiService/expensesApi';
import { getDepartments } from '../../apiService/departmentApi';
import { Row, Col, DatePicker, Select, Card, Button, Flex } from 'antd';
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
  const [departments, setDepartments] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [expenseType, setExpenseType] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getOneUser(userId);
      const expensesData = await getExpenses();
      const departmentsData = await getDepartments();
      setUser(userData);
      setExpenses(expensesData);
      setFilteredExpenses(expensesData);
      setDepartments(departmentsData);
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, dateRange, expenseType, departmentFilter]); 

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const handleTypeChange = (value) => {
    setExpenseType(value);
  };

  const handleDepartmentChange = (value) => {
    setDepartmentFilter(value);
  };

  const filterExpenses = () => {
    let filtered = expenses;
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(expense => moment(expense.createdAt).isBetween(dateRange[0], dateRange[1]));
    }
    if (expenseType) {
      filtered = filtered.filter(expense => expense.paymentMethod === expenseType);
    }
    if (departmentFilter) {
      filtered = filtered.filter(expense => expense.departmentId === departmentFilter);
    }
    setFilteredExpenses(filtered);
  };

  const resetFilters = () => {
    setDateRange([null, null]);  
    setExpenseType(null);        
    setDepartmentFilter(null);  
    setFilteredExpenses(expenses);  
  };

  const getPieChartOptions = () => {
    const categories = [...new Set(filteredExpenses.map(expense => expense.paymentMethod))];
    const seriesData = categories.map(category => {
      const total = filteredExpenses
        .filter(expense => expense.paymentMethod === category)
        .reduce((acc, expense) => acc + (expense.expenseFood || 0 + expense.expenseTravel || 0 + expense.expenseLodging || 0), 0);
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
          .reduce((acc, expense) => acc + (expense.expenseFood || 0 + expense.expenseTravel || 0 + expense.expenseLodging || 0), 0)
      };
    });

    return {
      title: {
        text: 'Gastos en el Tiempo',
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
        text: 'Gastos por Categoría',
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
        <Col span={24}>
          <Card>
            <div className="flex">
              <RangePicker onChange={handleDateChange} />
              <Select style={{ width: 120, marginLeft: '10px' }} onChange={handleTypeChange} placeholder="Tipo de gasto">
                <Option value="Personal">Personal</Option>
                <Option value="Business Card">Business Card</Option>
              </Select>
              <Select style={{ width: 120, marginLeft: '10px' }} onChange={handleDepartmentChange} placeholder="Departamento">
                {departments.map(dept => <Option key={dept._id} value={dept._id}>{dept.departmentName}</Option>)}
              </Select>
              <Button style={{ marginLeft: '10px' }} onClick={resetFilters}>Resetear Filtros</Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="General">
            <ReactEcharts option={getPieChartOptions()} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Gastos en el Tiempo">
            <ReactEcharts option={getLineChartOptions()} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Gastos por Categoría">
            <ReactEcharts option={getBarChartOptions()} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;