import { useEffect, useState } from "react";
import { deleteExpenses, getExpenses, getOneExpense } from "../../apiService/expensesApi";
import { Space, Table, Input, Popconfirm } from 'antd';

const { Search } = Input;

const Expenses = () => {
    const [allExpenses, setAllExpenses] = useState([])
    const [error, setError] = useState("")
    const [dummy, refresh] = useState(false)
    const [filtering, setFiltering] = useState([])
    
    const getAllExpenses = async () => {
        const expenses = await getExpenses();
        if (expenses.length) setAllExpenses(expenses);
        else setError(expenses.message)
    }
    
    useEffect(() => {
        getAllExpenses()
    }, [dummy]);
    
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});

    const onSearch = (value, _e, info) => {
        console.log(info?.source, value)
        const newList = [...allExpenses]
        if (info) { 
            const filteredData = newList.filter(info => 
                info.absenceId.employeeId.name.toLowerCase().includes(value.toLowerCase()) ||
                info.absenceId.employeeId.surname.toLowerCase().includes(value.toLowerCase()) ||
                info.absenceId.absenceCodeId.absenceName.toLowerCase().includes(value.toLowerCase()) ||
                info.absenceId.absenceCodeId.absenceService.toLowerCase().includes(value.toLowerCase())
            )
            if (filteredData) return setFiltering(filteredData)
        }
        if (!info) allExpenses
    };

    const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    };

    const handleDelete = async (id) => {
        await deleteExpenses(id);
        refresh(!dummy)
        // const newData = allExpenses.filter(item => item._id !== id);
        // console.log(newData)
        // setAllExpenses(data);
    };

    function formatDate(dateString) {
        return new Date(dateString).toISOString().split("T")[0];
    }

const columns = [
{
    title: 'Fecha de envío',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: text => formatDate(text),
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    sortOrder: sortedInfo.columnKey === 'createdAt' ? sortedInfo.order : null,
    ellipsis: true,
},
{
    title: 'Título',
    dataIndex: ['absenceId', 'absenceCodeId', 'absenceName'],
    key: 'absenceName',
    render: (text) => <a>{text}</a>,
},
{
    title: 'Motivo',
    dataIndex: ['absenceId', 'absenceCodeId', 'absenceService'],
    key: 'absenceService',
},
{
    title: 'Nombre',
    dataIndex: ['absenceId', 'employeeId', 'name'],
    key: 'name',
},
{
    title: 'Apellido',
    dataIndex: ['absenceId', 'employeeId', 'surname'],
    key: 'surname',
},
{
    title: 'Fecha de gasto',
    dataIndex: 'expenseDate',
    key: 'expenseDate',
    render: text => formatDate(text),
    sorter: (a, b) => (new Date(a.expenseDate)) - (new Date(b.expenseDate)),
    sortOrder: sortedInfo.columnKey === 'expenseDate' ? sortedInfo.order : null,
    ellipsis: true,
},
{
    title: 'Tipo de pago',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
    filters: [
        {
            text: 'Personal',
            value: 'Personal',
        },
        {
            text: 'Business Card',
            value: 'Business Card',
        },
    ],
    filteredValue: filteredInfo.paymentMethod || null,
    onFilter: (value, record) => record.paymentMethod.includes(value),
},
{
    title: 'Estado',
    dataIndex: 'expenseStatus',
    key: 'expenseStatus',
    filters: [
        {
            text: 'Pendiente',
            value: 'Pendiente',
        },
        {
            text: 'Aprobado',
            value: 'Aprobado',
        },
    ],
    filteredValue: filteredInfo.status || null,
    onFilter: (value, record) => record.status.includes(value),
},
{
    title: 'Monto en Euros',
    dataIndex: 'expenseEuros',
    key: 'expenseEuros',
    sorter: (a, b) => a.amount - b.amount,
    sortOrder: sortedInfo.columnKey === 'amount' ? sortedInfo.order : null,
    ellipsis: true,
},
{
    title: '',
    key: 'action',
    width: '8%',
    render: (_, record) => (
        <Space size="middle">
        <a>Aprobar {record.title}</a>
        </Space>
    ),
},
{
    title: '',
    key: 'action',
    width: '8%',
    render: (_, record) =>
    allExpenses.length >= 1 ? (
        <Space>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
                    <a>Eliminar</a>
                </Popconfirm>
            </Space>
        ) : null,
},

];

// const data = [
// {
//     key: '1',
//     purpose: 'V-084',
//     requestDate: '14/05/2024',
//     name: 'John', 
//     surname: 'Gonzalez',
//     expenseDate: '10/05/2024',
//     status: 'Pendiente',
//     amount: 20,
// },
// {
//     key: '2',
//     purpose: 'PV-080',
//     requestDate: '08/05/2024',
//     name: 'Jim', 
//     surname: 'Fernandez',
//     expenseDate: '05/05/2024',
//     status: 'Aprobado',
//     amount: 268,
// },
// {
//     key: '3',
//     purpose: 'V-083',
//     requestDate: '17/05/2024',
//     name: 'Joe', 
//     surname: 'Rodriguez',
//     expenseDate: '16/05/2024',
//     status: 'Pendiente',
//     amount: 64,
// },
// ];

    return (
    <>
        <h1>Todos los gastos: </h1>
        <div className="flex justify-end my-5">
        <Space direction="vertical">
            <Search
                placeholder="Buscar..."
                allowClear
                enterButton="Buscar"
                size="large"
                onSearch={onSearch}
            />
        </Space> 
        </div>
        <Table 
            columns={columns} 
            dataSource={filtering.length > 0 ? filtering : allExpenses} 
            onChange={handleChange} 
            // key={}
        />
        {error && <p>Ha habido un error: {error}</p>}
        <div> Traslados, Dietas y Hospedajes </div> <br />
        {allExpenses.map((expense, index) => (
            <div key={index}>
                <h1>{expense.expenseCodeId.map((gasto, i) => (
                    <div key={i}>
                        <h1>Traslado: {gasto.Traslados}</h1> <br />
                        <h1>Dieta: {gasto.Dietas}</h1> <br />
                        <h1>Hospedaje: {gasto.Hospedajes}</h1> <br />
                    </div>
                ))}</h1>
            </div>
            ))}
    </>
    )}
    
export default Expenses;