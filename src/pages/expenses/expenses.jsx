import { useEffect, useState } from "react";
import {
    approvedExpenses,
    deleteExpenses,
    emailExpenses,
    getExpenses,
    updateExpenses,
} from "../../apiService/expensesApi";
import {
    Space,
    Table,
    Input,
    Popconfirm,
    DatePicker,
    Typography,
    Button,
    Form,
    Modal,
    Flex,
    message,
} from "antd";
import TokenModal from '../../components/modals/modalToken';
import ExpenseProofModal from '../../components/modals/modalExpenseProof';
import ExpenseModal from "../../components/modals/modalExpenses";
import { getAbsences } from "../../apiService/absencesApi";
import { useAuth } from "../../contexts/authContext"

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

const Expenses = () => {
    const { userId, isHR } = useAuth();
    const [isModalTokenVisible, setIsModalTokenVisible] = useState(false)
    const [isExpenseProofModalVisible, setIsExpenseProofModalVisible] = useState(false)
    const [currentExpenseProof, setCurrentExpenseProof] = useState('')
    const [selectedExpense, setSelectedExpense] = useState(null)
    const [allExpenses, setAllExpenses] = useState([]);
    const [allAbsences, setAllAbsences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dummy, refresh] = useState(false);
    const [filtering, setFiltering] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [dates, setDates] = useState([]);
    const [expensePayment, setExpensePayment] = useState("");
    const [send, setSend] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [approved, setApproved] = useState(false);
    const [approvedId, setApprovedId] = useState("");
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getAllExpenses();
        getAllAbsences();
    }, [dummy, userId]);

    const showExpenseProof = (url) => {
        setCurrentExpenseProof(url)
        setIsExpenseProofModalVisible(true)
    }

    const hideExpenseProof = () => {
        setCurrentExpenseProof('')
        setIsExpenseProofModalVisible(false)
    }

    const checkTokenValidity = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setIsModalTokenVisible(true);
            return false;
        }
        return true;
    };

    const getAllExpenses = async () => {
        setLoading(true)
        try {
            const expenses = await getExpenses()
            const notRemoved = expenses.filter((user) => !user.removedAt);
            if (isHR !== "HR") {
                const userExpenses = notRemoved.filter((expense) => expense.absenceId.employeeId._id === userId)
                setAllExpenses(userExpenses)
                setLoading(false)
            } else {
                setAllExpenses(notRemoved)
                setLoading(false)
            }
            if ((expenses.error && expenses.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
                setIsModalTokenVisible(true);
            }
            else setError(expenses.message);
        } catch (error) {
            console.log(error)
        }
    };

    const getAllAbsences = async () => {
        const absences = await getAbsences();
        const notRemoved = absences.filter((absence) => !absence.removeAt);
        if (absences.length) setAllAbsences(notRemoved);
        else setError(absences.message);
    };

    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
        const newList = [...allExpenses];
        if (info) {
            const filteredData = newList.filter(
                (info) =>
                    info.absenceId.absenceName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.absenceId.employeeId.name
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.absenceId.employeeId.surname
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.absenceId.country
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.absenceId.city
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.absenceId.absenceService
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.absenceId.absenceCode
                        ?.toLowerCase()
                        .includes(value.toLowerCase())
            );
            if (filteredData) return setFiltering(filteredData);
        }
        if (!info) allExpenses;
    };

    const onDateChangeCreation = (dates, dateStringsC) => {
        setDates(dateStringsC);
        filterDataByDateC(dateStringsC);
    };

    const filterDataByDateC = (dateStringsC) => {
        const [start, end] = dateStringsC;
        const filtered = allExpenses.filter(
            (item) =>
                new Date(item.createdAt).getTime() >=
                new Date(start).getTime() &&
                new Date(item.createdAt).getTime() <=
                new Date(end).getTime()
        );
        setFiltering(filtered);
    };

    const onDateChangeExpense = (dates, dateStringsE) => {
        setDates(dateStringsE);
        filterDataByDateE(dateStringsE);
    };

    const filterDataByDateE = (dateStringsE) => {
        const [start, end] = dateStringsE;
        console.log(start, end);
        const filtered = allExpenses.filter(
            new Date(item.absenceId.startDate).getTime() >=
            new Date(start).getTime() &&
            new Date(item.absenceId.startDate).getTime() <=
            new Date(end).getTime()
        );
        setFiltering(filtered);
    };

    const onDateChangePayment = (dates, dateStringsP) => {
        setDates(dateStringsP);
        filterDataByDateP(dateStringsP);
    };

    const filterDataByDateP = (dateStringsP) => {
        const [start, end] = dateStringsP;
        const filtered = allExpenses.filter(
            (item) =>
                new Date(item.expensePayment).getTime() >=
                new Date(start).getTime() &&
                new Date(item.expensePayment).getTime() <=
                new Date(end).getTime()
        );
        setFiltering(filtered);
    };

    const handleChange = (pagination, filters, sorter) => {
        console.log("Various parameters", pagination, filters, sorter);
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const handleEdit = (expense) => {
        if (checkTokenValidity()) {
            setSelectedExpense(expense)
            setOpen(true)
        }
    }

    const handleExpenseCancel = () => {
        setOpen(false)
        setSelectedExpense(null)
    }

    const handleDelete = async (id) => {
        await deleteExpenses(id);
        message.success('Gasto eliminado con éxito')
        refresh(!dummy);
    };

    function formatDate(dateString) {
        return dateString.split("T")[0];
    }

    const onChangeDate = async (date, dateString) => {
        const newDate = new Date(dateString);
        setExpensePayment(newDate);
        await updateExpenses(approvedId, { expensePayment: newDate });
        message.success('Fecha de pago cambiada')
        refresh(!dummy);
    };

    const onDeleteDate = async (id) => {
        await updateExpenses(id, {
            expensePayment: null,
            expenseStatus: "Pendiente",
        });
        message.success('Fecha de aprobación eliminada')
        refresh(!dummy);
    };

    const handleOpenDatePicker = (id) => {
        setApprovedId(id);
        setIsDatePickerVisible(true);
        setSend(false);
    };

    const handleConfirmSendEmail = () => {
        setIsDatePickerVisible(false);
        setSend(true);
    };

    const sendEmail = async () => {
        await emailExpenses(approvedId);
        message.success('Email de confirmación enviado')
        refresh(!dummy);
        setSend(false);
    };

    const sendApproval = async () => {
        await approvedExpenses(approvedId);
        message.success('Email de confirmación enviado')
        refresh(!dummy);
        setApproved(false);
    };

    const handleOpenApprove = (id) => {
        setApprovedId(id);
        setApproved(true);
    };

    const addExpense = () => {
        setSelectedExpense(null)
        setOpen(true);
    };

    const columns = [
        {
            title: "Fecha de envío",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => formatDate(text),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortOrder:
                sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: "Título",
            dataIndex: ["absenceId", "absenceName"],
            key: "absenceName",
        },
        {
            title: "Nombre",
            width: "7%",
            dataIndex: ["absenceId", "employeeId", "name"],
            key: "name",
        },
        {
            title: "Apellido",
            dataIndex: ["absenceId", "employeeId", "surname"],
            key: "surname",
        },
        {
            title: "Fecha de inicio",
            dataIndex: ["absenceId", "startDate"],
            key: "expenseDate",
            render: (text) => formatDate(text),
            sorter: (a, b) =>
                new Date(a.absenceId.startDate) -
                new Date(b.absenceId.startDate),
            sortOrder:
                sortedInfo.columnKey === "expenseDate"
                    ? sortedInfo.order
                    : null,
            ellipsis: true,
        },
        {
            title: "Tipo de pago",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            filters: [
                {
                    text: "Personal",
                    value: "Personal",
                },
                {
                    text: "Business Card",
                    value: "Business Card",
                },
            ],
            filteredValue: filteredInfo.paymentMethod || null,
            onFilter: (value, record) => record.paymentMethod.includes(value),
        },
        {
            title: "Estado",
            width: "7%",
            dataIndex: "expenseStatus",
            key: "expenseStatus",
            filters: [
                {
                    text: "Pendiente",
                    value: "Pendiente",
                },
                {
                    text: "Aprobado",
                    value: "Aprobado",
                },
            ],
            filteredValue: filteredInfo.expenseStatus || null,
            onFilter: (value, record) => record.expenseStatus.includes(value),
        },
        {
            title: "Monto (€)",
            dataIndex: "expenseCodes",
            width: "9%",
            key: "expenseCodes",
            render: (_, record) =>
                (record.expenseFood ? record.expenseFood : 0) +
                (record.expenseLodging ? record.expenseLodging : 0) +
                (record.expenseTravel ? record.expenseTravel : 0) +
                " €",
            sorter: (a, b) => {
                const totalA =
                    (a.expenseFood ? a.expenseFood : 0) +
                    (a.expenseLodging ? a.expenseLodging : 0) +
                    (a.expenseTravel ? a.expenseTravel : 0);
                const totalB =
                    (b.expenseFood ? b.expenseFood : 0) +
                    (b.expenseLodging ? b.expenseLodging : 0) +
                    (b.expenseTravel ? b.expenseTravel : 0);
                return totalA - totalB;
            },
            sortOrder:
                sortedInfo.columnKey === "expenseCodes"
                    ? sortedInfo.order
                    : null,
            ellipsis: true,
        },
        {
            title: "",
            key: "action",
            width: "7%",
            render: (_, record) =>
                isHR === "HR" ?
                    (record.paymentMethod === "Personal" ? (
                        <Space size="middle">
                            <Button
                                key={record._id}
                                type="primary"
                                onClick={() => handleOpenDatePicker(record._id)}
                            >
                                Aprobar
                            </Button>
                            <Modal
                                zIndex={approvedId}
                                title={"Selecciona una Fecha"}
                                open={isDatePickerVisible}
                                onOk={handleConfirmSendEmail}
                                onCancel={() => setIsDatePickerVisible(false)}
                            >
                                <DatePicker
                                    onChange={(date, dateString) =>
                                        onChangeDate(date, dateString)
                                    }
                                    needConfirm
                                />
                            </Modal>
                            <Modal
                                title="Confirmar envio de correo"
                                open={send}
                                onOk={() => sendEmail()}
                                onCancel={handleOpenDatePicker}
                            >
                                <p>
                                    {"Se enviará un correo con la fecha elegida: " +
                                        expensePayment}
                                </p>
                            </Modal>
                        </Space>
                    ) : (
                        <Space size="middle">
                            <Button
                                key={record._id}
                                type="primary"
                                onClick={() => handleOpenApprove(record._id)}
                            >
                                Aprobar
                            </Button>
                            <Modal
                                zIndex={approvedId}
                                title={"Confirmar envio de correo"}
                                open={approved}
                                onOk={() => sendApproval()}
                                onCancel={() => setApproved(false)}
                            >
                                <p>
                                    Se enviará un correo con la fecha del recibí:{" "}
                                    <strong>{Date()}</strong>
                                </p>
                            </Modal>
                        </Space>)
                    )
                    : null
        },
        {
            title: "",
            key: "action",
            width: '5%',
            render: (_, record) =>
                allExpenses.length >= 1 ? (
                    <Space>
                        <Typography.Link onClick={() => handleEdit(record)}>Editar</Typography.Link>
                    </Space>
                ) : null,
        },
        {
            title: "",
            key: "action",
            width: '6%',
            render: (_, record) =>
                allExpenses.length >= 1 ? (
                    <Space>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record._id)}
                        >
                            <Typography.Link>Eliminar</Typography.Link>
                        </Popconfirm>
                    </Space>
                ) : null,
        },
    ];

    return (
        <>
            <Flex wrap justify="space-between" align="flex-start">
                <div className="title-box">
                    <h1 className='title'>Listado de gastos</h1>
                    <h2 className='subtitle'>Detalle de todos tus gastos</h2>
                </div>
                {isHR !== "HR" ?
                    <div className="flex justify-end my-5">
                        <Button type="primary" onClick={addExpense}>
                            Crear gasto
                        </Button>
                    </div>
                    : null}
            </Flex>
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
                    <div className="mb-5 ml-5">
                        <div className="mb-3">Buscar por fecha de pago:</div>
                        <Space direction="vertical" size={12}>
                            <RangePicker onChange={onDateChangePayment} />
                        </Space>
                    </div>
                </div>
            </div>
            <Table
                loading={loading}
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => (
                        <div className="flex">
                            <div>
                                <p className="font-bold">Gastos:</p>
                                <p>
                                    Hospedajes: {""}
                                    {record.expenseLodging
                                        ? record.expenseLodging
                                        : 0}
                                    €
                                </p>
                                <p>
                                    Dietas: {""}
                                    {record.expenseFood
                                        ? record.expenseFood
                                        : 0}
                                    €
                                </p>
                                <p>
                                    Traslados:{" "}
                                    {record.expenseTravel > 0
                                        ? record.expenseTravel
                                        : 0}
                                    €
                                </p>
                            </div>
                            <div className="ml-32">
                                <p className="font-bold">País:</p>
                                {record.absenceId.country}
                                <p className="font-bold">Ciudad:</p>
                                {record.absenceId.city}
                            </div>
                            <div className="ml-32">
                                <p className="font-bold">Motivo:</p>
                                {record.absenceId.absenceService}
                                <p className="font-bold">Código:</p>
                                {record.absenceId.absenceCode
                                    ? record.absenceId.absenceCode
                                    : "-"}
                            </div>
                            <div className="ml-32">
                                <p className="font-bold">Business Card:</p>
                                {record.creditCardEnd
                                    ? record.creditCardEnd
                                    : "-"}
                            </div>
                            <div className="ml-32">
                                <p className="font-bold">
                                    Fecha de pago/Aprobación:
                                </p>
                                {record.expensePayment
                                    ? record.expensePayment.split("T")[0]
                                    : "-"}
                                {record.expensePayment ? (
                                    <Button type="link">
                                        <Space>
                                            <Popconfirm
                                                title="Sure to delete?"
                                                onConfirm={() =>
                                                    onDeleteDate(record._id)
                                                }
                                            >
                                                <a>No aprobado</a>
                                            </Popconfirm>
                                        </Space>
                                    </Button>
                                ) : null}
                            </div>
                            <div className="ml-32">
                                <p className="font-bold">Tickets:</p>
                                {record.expenseProof && record.expenseProof.length > 0
                                    ? record.expenseProof.map((url, index) => (
                                        <Button type="link"
                                            key={index}
                                            onClick={() => showExpenseProof(url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ padding: '0', display: "block", height: "22px" }}
                                        >
                                            Ticket {index + 1}
                                        </Button>
                                    ))
                                    : "-"
                                }
                            </div>
                        </div>
                    ),
                }}
                dataSource={filtering.length > 0 ? filtering : allExpenses}
                onChange={handleChange}
                rowKey="_id"
                summary={(pageData) => {
                    let totalExpense = 0;
                    pageData.forEach((record) => {
                        const recordTotal =
                            (record.expenseFood ? record.expenseFood : 0) +
                            (record.expenseLodging
                                ? record.expenseLodging
                                : 0) +
                            (record.expenseTravel ? record.expenseTravel : 0);
                        totalExpense += recordTotal;
                    });
                    return (
                        <>
                            <Table.Summary.Row className="">
                                <Table.Summary.Cell index={0} colSpan={7} />
                                <Table.Summary.Cell
                                    index={7}
                                    className="font-bold"
                                >
                                    Total
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <Text className="font-bold">
                                        {totalExpense} €
                                    </Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            />
            {error && <p>Ha habido un error: {error}</p>}
            <TokenModal visible={isModalTokenVisible} />
            <ExpenseProofModal
                visible={isExpenseProofModalVisible}
                onCancel={hideExpenseProof}
                expenseUrl={currentExpenseProof}
            />
            <ExpenseModal
                visible={open}
                onCancel={handleExpenseCancel}
                expense={selectedExpense}
                allAbsences={allAbsences}
                refresh={refresh}
            />
            {error && <p>Ha habido un error: {error}</p>}
        </>
    );
};

export default Expenses;
