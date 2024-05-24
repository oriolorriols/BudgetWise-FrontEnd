import { useEffect, useState } from "react";
import { getExpenses } from "../../apiService/expensesApi";
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
            const filteredDataCreatedAt = newList.filter(info => info.createdAt.toLowerCase().includes(value.toLowerCase()))         
            const filteredDataExpenseType = newList.filter(info => info.expenseType.toLowerCase().includes(value.toLowerCase()))
            if (filteredDataCreatedAt) return setFiltering(filteredDataCreatedAt)
            if (filteredDataExpenseType) return setFiltering(filteredDataExpenseType)
        }
        if (!info) allExpenses
    };
    // const onSearch = (value) => {
    //     console.log(value)
    //     const filteredData = allExpenses.filter((data) => data.includes(value))
    //     setAllExpenses(filteredData)
    // };

    const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    };

    const handleDelete = (key) => {
        const newData = allExpenses.filter((item) => item.key !== key);
        setAllExpenses(newData);
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
    title: 'Motivo',
    dataIndex: 'expenseType',
    key: 'expenseType',
    render: (text) => <a>{text}</a>,
},
{
    title: 'Nombre',
    dataIndex: 'name',
    key: 'name',
},
{
    title: 'Apellido',
    dataIndex: 'surname',
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
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
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
    dataIndex: 'amount',
    key: 'amount',
    sorter: (a, b) => a.amount - b.amount,
    sortOrder: sortedInfo.columnKey === 'amount' ? sortedInfo.order : null,
    ellipsis: true,
},
{
    title: 'Editar',
    key: 'action',
    width: '8%',
    render: (_, record) => (
        <Space size="middle">
        <a>Editar {record.purpose}</a>
        </Space>
    ),
},
{
    title: 'Delete',
    key: 'action',
    width: '8%',
    render: (_, record) =>
        (
            <Space>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                    <a>Eliminar</a>
                </Popconfirm>
            </Space>
        ) 
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
            onChange={handleChange} />
            {error && <p>Ha habido un error: {error}</p>}
    </>
    )}
    
export default Expenses;