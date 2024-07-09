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
} from "antd";
import ExpenseModal from "../../components/modals/modalExpenses";
import { getAbsences } from "../../apiService/absencesApi";
const { Text } = Typography;

const { RangePicker } = DatePicker;

const { Search } = Input;

const Expenses = () => {
    const [allExpenses, setAllExpenses] = useState([]);
    const [allAbsences, setAllAbsences] = useState([]);
    const [error, setError] = useState("");
    const [dummy, refresh] = useState(false);
    const [filtering, setFiltering] = useState([]);

    const getAllExpenses = async () => {
        const expenses = await getExpenses();
        const notRemoved = expenses.filter((user) => !user.removedAt);
        if (expenses.length) setAllExpenses(notRemoved);
        else setError(expenses.message);
    };

    const getAllAbsences = async () => {
        const absences = await getAbsences();
        const notRemoved = absences.filter((absence) => !absence.removeAt);
        if (absences.length) setAllAbsences(notRemoved);
        else setError(absences.message);
    };

    useEffect(() => {
        getAllExpenses();
        getAllAbsences();
    }, [dummy]);

    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});

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

    const [dates, setDates] = useState([]);

    const onDateChangeCreation = (dates, dateStringsC) => {
        setDates(dateStringsC);
        filterDataByDateC(dateStringsC);
    };

    const filterDataByDateC = (dateStringsC) => {
        const [start, end] = dateStringsC;
        const filtered = allExpenses.filter(
            (item) => item.createdAt >= start && item.createdAt <= end
        );
        setFiltering(filtered);
    };

    const onDateChangeExpense = (dates, dateStringsE) => {
        setDates(dateStringsE);
        filterDataByDateE(dateStringsE);
    };

    const filterDataByDateE = (dateStringsE) => {
        const [start, end] = dateStringsE;
        const filtered = allExpenses.filter(
            (item) => item.expenseDate >= start && item.expenseDate <= end
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
            (item) => item.expensePayment >= start && item.expensePayment <= end
        );
        setFiltering(filtered);
    };

    const handleChange = (pagination, filters, sorter) => {
        console.log("Various parameters", pagination, filters, sorter);
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const handleDelete = async (id) => {
        await deleteExpenses(id);
        refresh(!dummy);
    };

    function formatDate(dateString) {
        return dateString.split("T")[0];
    }

    const [expensePayment, setExpensePayment] = useState("");
    const [send, setSend] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [approved, setApproved] = useState(false);
    const [approvedId, setApprovedId] = useState("");

    const onChangeDate = async (date, dateString) => {
        const newDate = new Date(dateString);
        setExpensePayment(newDate);
        await updateExpenses(approvedId, { expensePayment: newDate });
        refresh(!dummy);
    };

    const onDeleteDate = async (id) => {
        await updateExpenses(id, {
            expensePayment: null,
            expenseStatus: "Pendiente",
        });
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
        refresh(!dummy);
        setSend(false);
    };

    const sendApproval = async () => {
        await approvedExpenses(approvedId);
        refresh(!dummy);
        setApproved(false);
    };

    const handleOpenApprove = (id) => {
        setApprovedId(id);
        setApproved(true);
    };

    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    const addExpense = () => {
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
            width: "8%",
            dataIndex: "expenseCodes",
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
            width: "10%",
            render: (_, record) =>
                record.paymentMethod === "Personal" ? (
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
                    </Space>
                ),
        },
        {
            title: "",
            key: "action",
            width: "6%",
            render: (_, record) =>
                allExpenses.length >= 1 ? (
                    <Space>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record._id)}
                        >
                            <a>Eliminar</a>
                        </Popconfirm>
                    </Space>
                ) : null,
        },
    ];

    return (
        <>
            <div>
                <h2 className="text-xl font-bold">Lista de Gastos</h2>
            </div>
            <div className="flex justify-end my-5">
                <Button type="primary" onClick={addExpense}>
                    Crear gasto
                </Button>
            </div>
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
            <ExpenseModal
                visible={open}
                onCancel={() => setOpen(false)}
                allAbsences={allAbsences}
                refresh={refresh}
            />
            {error && <p>Ha habido un error: {error}</p>}
        </>
    );
};

export default Expenses;
