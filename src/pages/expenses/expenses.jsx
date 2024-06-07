import { useEffect, useState } from "react";
import { deleteExpenses, getExpenses, updateExpenses } from "../../apiService/expensesApi";
import { Space, Table, Input, Popconfirm, DatePicker, Button, Popover } from 'antd';

const { RangePicker } = DatePicker

const { Search } = Input;

const Expenses = () => {
    const [allExpenses, setAllExpenses] = useState([])
    const [error, setError] = useState("")
    const [dummy, refresh] = useState(false)
    const [filtering, setFiltering] = useState([])
    
    const getAllExpenses = async () => {
        const expenses = await getExpenses()
        const notRemoved = expenses.filter(user => !user.removedAt);
        if (expenses.length) setAllExpenses(notRemoved);
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
                info.absenceId.absenceCodeId.absenceName.toLowerCase().includes(value.toLowerCase()) ||
                info.absenceId.employeeId.name.toLowerCase().includes(value.toLowerCase()) ||
                info.absenceId.employeeId.surname.toLowerCase().includes(value.toLowerCase()) ||
                info.absenceId.country.toLowerCase().includes(value.toLowerCase()) ||
                info.absenceId.city.toLowerCase().includes(value.toLowerCase()) ||
                info.absenceId.absenceCodeId.absenceService.toLowerCase().includes(value.toLowerCase()) ||
                info.absenceId.absenceCodeId.absenceCode?.toLowerCase().includes(value.toLowerCase())
                )
            if (filteredData) return setFiltering(filteredData)
        }
        if (!info) allExpenses
    };

    const [dates, setDates] = useState([]);

    const onDateChangeCreation = (dates, dateStringsC) => {
        setDates(dateStringsC);
        filterDataByDateC(dateStringsC);
    };
        
    const filterDataByDateC = (dateStringsC) => {
        const [start, end] = dateStringsC;
        const filtered = allExpenses.filter(item => 
            item.createdAt >= start && item.createdAt <= end
            );
            setFiltering(filtered);
        };
        
    const onDateChangeExpense = (dates, dateStringsE) => {
        setDates(dateStringsE);
        filterDataByDateE(dateStringsE);
    };

    const filterDataByDateE = (dateStringsE) => {
        const [start, end] = dateStringsE;
        const filtered = allExpenses.filter(item => 
            item.expenseDate >= start && item.expenseDate <= end
        );
        setFiltering(filtered);
    };

    const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    };

    const handleDelete = async (id) => {
        await deleteExpenses(id);
        refresh(!dummy)
    };
    
    function formatDate(dateString) {
        return new Date(dateString).toISOString().split("T")[0];
    }
    
    const [expensePayment, setExpensePayment] = useState("")

    const onChangeDate = async (date, dateString, id) => {
        const newDate = new Date(dateString).toISOString();
        console.log("date: ", typeof newDate, newDate, "id: ", id)
        setExpensePayment(newDate)
        await updateExpenses(id, {expensePayment});
        refresh(!dummy)
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
    filteredValue: filteredInfo.expenseStatus || null,
    onFilter: (value, record) => record.expenseStatus.includes(value),
},
{
    title: 'Monto en Euros',
    dataIndex: 'expenseCodeId',
    key: 'expenseCodeId',
    render: (codes) => (
        <div className="flex">
            <ul>
                {codes.map((code, index) => (
                    <li key={index}>
                        {(code.Traslados > 0 ? code.Traslados : 0) + 
                        (code.Dietas > 0 ? code.Dietas : 0) + 
                        (code.Hospedajes > 0 ? code.Hospedajes : 0)} 
                    </li>
                ))}
            </ul>
            <p className="ml-1">€</p>
        </div>
    ),
    sorter: (a, b) => a.amount - b.amount,
    sortOrder: sortedInfo.columnKey === 'amount' ? sortedInfo.order : null,
    ellipsis: true,
},
{
    title: 'Aprobar',
    key: 'action',
    width: '7%',
    render: (_, record) => (
        <Space size="middle">
            <DatePicker onChange={(date, dateString) => onChangeDate(date, dateString, record._id)} needConfirm />
        </Space>
    ),
},
{
    title: '',
    key: 'action',
    width: '5%',
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

    return (
    <>
        <h1>Todos los gastos: </h1>
        <div className="flex flex-row-reverse justify-between items-center my-5">
            <div className="flex justify-end my-5">
                <Space direction="vertical">
                    <Search
                        placeholder="Buscar texto..."
                        allowClear
                        enterButton="Buscar"
                        size="large"
                        onSearch={onSearch}
                    />
                </Space> 
            </div>
            <div className="flex">
                <div className="mb-5">
                    <div className="mb-3">Buscar por fecha de envío:</div>
                    <Space direction="vertical" size={12}>
                        <RangePicker onChange={onDateChangeCreation} />
                    </Space>
                </div>
                <div className="mb-5 ml-5">
                    <div className="mb-3">Buscar por fecha de gasto:</div>
                    <Space direction="vertical" size={12}>
                        <RangePicker onChange={onDateChangeExpense} />
                    </Space>
                </div>
            </div>
        </div>
        <Table 
            columns={columns}
            expandable={{
                expandedRowRender: record => (
                    <div className="flex">
                        {record.expenseCodeId.map((code, index) => (
                        <div key={index}>
                            <p className="font-bold">Gastos:</p>
                            <p>Hospedajes: {code.Hospedajes > 0 ? code.Hospedajes : 0} €</p>
                            <p>Dietas: {code.Dietas > 0 ? code.Dietas : 0} €</p>
                            <p>Traslados: {code.Traslados > 0 ? code.Traslados : 0} €</p>
                        </div>
                    ))}
                        <div className="ml-32">
                            <p className="font-bold">País:</p>
                            {record.absenceId.country}
                            <p className="font-bold">Ciudad:</p>
                            {record.absenceId.city}
                        </div>
                        <div className="ml-32">
                            <p className="font-bold">Motivo:</p>
                            {record.absenceId.absenceCodeId.absenceService}
                            <p className="font-bold">Código:</p>
                            {record.absenceId.absenceCodeId.absenceCode? record.absenceId.absenceCodeId.absenceCode : "-"}
                        </div>
                        <div className="ml-32">
                            <p className="font-bold">Business Card:</p>
                            {record.creditCardEnd? record.creditCardEnd : "-"}
                        </div>
                        <div className="ml-32">
                            <p className="font-bold">Fecha de pago:</p>
                            {record.expensePayment? record.expensePayment : "-"}
                        </div>
                    </div>
                ),
            }}
            dataSource={filtering.length > 0 ? filtering : allExpenses} 
            onChange={handleChange} 
            rowKey="_id"
            />
        {error && <p>Ha habido un error: {error}</p>}
        </>
    )}
    
export default Expenses;