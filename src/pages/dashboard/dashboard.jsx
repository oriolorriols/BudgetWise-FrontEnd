import React, { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/authContext";
import { getOneUser } from '../../apiService/userApi';
import { getExpenses } from '../../apiService/expensesApi';
import { getDepartments } from '../../apiService/departmentApi';
import BudgetModal from '../../components/modals/modalDepartmentBudget';
import { Row, Col, DatePicker, Select, Card, Button, Alert, Checkbox, Progress } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const conicColors = {
  '0%': '#87d068',
  '50%': '#ffe58f',
  '100%': 'rgb(236, 91, 86)',
};

const Dashboard = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showMonthlyTrend, setShowMonthlyTrend] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [budget, setBudget] = useState({});

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

  const refreshDepartments = async () => {
    const departmentsData = await getDepartments();
    setDepartments(departmentsData);
  };

  useEffect(() => {
    filterExpenses();
  }, [expenses, dateRange, expenseTypes, departmentFilter, showMonthlyTrend]);

  useEffect(() => {
    checkAlerts();
  }, [filteredExpenses]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const handleTypeChange = (values) => {
    setExpenseTypes(values);
  };

  const handleDepartmentChange = (values) => {
    setDepartmentFilter(values);
  };

  const handleMonthlyTrendChange = (e) => {
    setShowMonthlyTrend(e.target.checked);
  };

  const filterExpenses = () => {
    let filtered = expenses;
    const currentYear = new Date().getFullYear();
  
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(expense => (new Date(expense.createdAt) >= new Date(dateRange[0]) && new Date(expense.createdAt) <= new Date(dateRange[1])));
    }
    if (expenseTypes.length) {
      filtered = filtered.filter(expense => expenseTypes.includes(expense.paymentMethod));
    }
    if (departmentFilter.length) {
      filtered = filtered.filter(expense => departmentFilter.includes(expense.absenceId.employeeId.departmentId._id));
    }
  
    filtered = filtered.filter(expense => new Date(expense.createdAt).getFullYear() === currentYear);
  
    setFilteredExpenses(filtered);
  };

  const checkAlerts = () => {
    const departmentExpenses = calculateDepartmentExpenses();
    const newAlerts = departmentExpenses.filter(department => department.percentageSpent >= 95).map(department => {
      if (department.percentageSpent > 100) {
        return `¡El departamento ${department.departmentName} ha superado su presupuesto anual!`;
      } else {
        return `¡El departamento ${department.departmentName} ha gastado más del 95% de su presupuesto anual!`;
      }
    });
    setAlerts(newAlerts);
  };

  const calculateDepartmentExpenses = () => {
    const departmentExpenses = departments.map(department => {
      const totalSpent = filteredExpenses
        .filter(expense => expense.absenceId.employeeId.departmentId._id === department._id)
        .reduce((acc, expense) => acc + (expense.expenseFood || 0) + (expense.expenseTravel || 0) + (expense.expenseLodging || 0), 0);
      
      const budget = department.departmentBudget || 0;
      const percentageSpent = Number((budget ? (totalSpent / budget) * 100 : 0).toFixed(0));
  
      return {
        departmentName: department.departmentName,
        totalSpent,
        budget,
        percentageSpent
      };
    });
  
    return departmentExpenses;
  };

  const resetFilters = () => {
    setDateRange([null, null]);  
    setExpenseTypes([]);        
    setDepartmentFilter([]);  
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
        text: 'Gastos por Tipo',
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

  const getPieChartOptionsByCategory = () => {
    const categories = ['Food', 'Travel', 'Lodging'];
    const seriesData = categories.map(category => {
      const total = filteredExpenses
        .reduce((acc, expense) => acc + (expense[`expense${category}`] || 0), 0);
      return {
        name: category,
        value: total
      };
    });

    return {
      title: {
        text: 'Gastos por Categoría',
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
    let dates = filteredExpenses.map(expense => moment(expense.createdAt).format('YYYY-MM-DD'));
    let uniqueDates = [...new Set(dates)];

    if (showMonthlyTrend) {
      dates = filteredExpenses.map(expense => moment(expense.createdAt).format('YYYY-MM'));
      uniqueDates = [...new Set(dates)];
    }

    const totalExpensesByDate = uniqueDates.map(date => {
      return {
        date,
        total: filteredExpenses
          .filter(expense => {
            if (showMonthlyTrend) {
              return moment(expense.createdAt).format('YYYY-MM') === date;
            }
            return moment(expense.createdAt).format('YYYY-MM-DD') === date;
          })
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
    const categories = [...departments.map(dept => dept.departmentName)];
    console.log(categories)

    const dates = [...new Set(filteredExpenses.map(expense => moment(expense.createdAt).format('YYYY-MM-DD')))];

    const groupedData = {}; 

    dates.forEach(date => {
      groupedData[date] = {};
      categories.forEach(category => {
        groupedData[date][category] = 0;
      });
    });


    filteredExpenses.forEach(expense => {
      const date = moment(expense.createdAt).format('YYYY-MM-DD');
      const departmentName = departments.find(dept => dept._id === expense.absenceId.employeeId.departmentId._id)?.departmentName || 'Unknown';
      if (groupedData[date] && groupedData[date][departmentName] !== undefined) {
        groupedData[date][departmentName] += (expense.expenseFood || 0) + (expense.expenseTravel || 0) + (expense.expenseLodging || 0);
      }
    });

    console.log(groupedData)

    const seriesData = categories.map(category => {
      return {
        name: category,
        type: 'bar',
        stack: 'total',
        data: dates.map(date => groupedData[date][category] || 0)
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
        data: dates
        // data: filteredExpenses.map(expense => moment(expense.createdAt).format('YYYY-MM-DD'))
      },
      yAxis: {
        type: 'value'
      },
      series: seriesData
    };
  };

  const exportData = () => {
    const csvData = filteredExpenses.map(expense => ({
      Fecha: moment(expense.createdAt).format('YYYY-MM-DD'),
      Tipo: expense.paymentMethod,
      Departamento: departments.find(dept => dept._id === expense.absenceId.employeeId.departmentId)?._id || '',
      Food: expense.expenseFood || 0,
      Travel: expense.expenseTravel || 0,
      Lodging: expense.expenseLodging || 0
    }));
  
    const csvContent = [
      ["Fecha", "Tipo", "Departamento", "Food", "Travel", "Lodging"],
      ...csvData.map(item => [item.Fecha, item.Tipo, item.Departamento, item.Food, item.Travel, item.Lodging])
    ].map(e => e.join(",")).join("\n");
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "gastos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
  <>
  <h1 className='text-xl font-bold'>Hola, {user?.name}!</h1>
  <Row gutter={16}>
    <Col span={24}>
        <div className="flex flex-row items-center py-3">
          <RangePicker onChange={handleDateChange} />
          <Select mode="multiple" style={{ width: 120, marginLeft: '10px' }} onChange={handleTypeChange} placeholder="Tipo de gasto">
            <Option value="Personal">Personal</Option>
            <Option value="Business Card">Business Card</Option>
          </Select>
          <Select mode="multiple" style={{ width: 120, marginLeft: '10px' }} onChange={handleDepartmentChange} placeholder="Departamento">
            {departments.map(dept => (
              <Option key={dept._id} value={dept._id}>{dept.departmentName}</Option>
            ))}
          </Select>
          <Checkbox style={{ marginLeft: '10px', display: 'flex'}} onChange={handleMonthlyTrendChange}>Tendencia Mensual</Checkbox>
          <Button style={{ marginLeft: '10px' }} onClick={resetFilters}>Resetear Filtros</Button>
          <Button style={{ marginLeft: '10px' }} onClick={exportData}>Exportar Datos</Button>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => setModalVisible(true)}>Objetivos Anuales</Button>
        </div>
    </Col>
  </Row>

  {alerts.map((alert, index) => (
    <Alert key={index} message={alert} type="warning" showIcon />
  ))}

  <Row gutter={16} className='flex flex-row items-center justify-evenly'>
    {calculateDepartmentExpenses().map(department => (
        <div className='flex flex-col items-center mx-6'>
          <h3 className='font-bold my-2'>{department.departmentName}</h3>
          <Progress type="dashboard" percent={department.percentageSpent} strokeColor={conicColors} size="small" format={(percent) => percent} status={department.percentageSpent >= 95 ? "exception" : "normal"}/>
          <p>{`Gastado: ${department.totalSpent}`}</p>
        </div>
    ))}
  </Row>

  <Row gutter={16}>
    <Col span={12}>
      <Card>
        <Row gutter={16}>
          <ReactEcharts option={getPieChartOptions()} style={{ width: '350px', height: '300px' }} />
          <ReactEcharts option={getPieChartOptionsByCategory()} style={{ width: '350px', height: '300px' }}/>
        </Row>
      </Card>
    </Col>
    <Col span={12}>
      <Card>
        <ReactEcharts option={getLineChartOptions()} style={{ width: '700px', height: '300px' }}/>
      </Card>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col span={24}>
      <Card >
        <ReactEcharts option={getBarChartOptions()} style={{ width: '1600px', height: '400px' }}/>
      </Card>
    </Col>
  </Row>

  <BudgetModal
    visible={modalVisible}
    onCancel={() => setModalVisible(false)}
    departments={departments}
    refresh={refreshDepartments}
  />

</>
);
}

export default Dashboard;