import { useEffect, useState } from "react";
import { getAbsences } from "../../apiService/absencesApi";
import { Button, Card, Space, Flex, Select, Spin, Empty, Alert, message } from 'antd';
import AbsencesCard from "./absenceCards";
import AbsenceModal from "../../components/modals/modalAbsences";
import { getUsers } from "../../apiService/userApi";
import { useAuth } from "../../contexts/authContext";
import Search from "antd/es/input/Search";

const { Option } = Select;

const Absences = () => {
    const [allAbsences, setAllAbsences] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [dummy, refresh] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const { userId, isHR } = useAuth();
    const [selectedAbsence, setSelectedAbsence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtering, setFiltering] = useState([]);

    useEffect(() => {
        getAllAbsences();
        getAllUsers();
        console.log("all users useEffect Absence.jsx ", allUsers);
    }, [dummy, userId]);

    const getAllAbsences = async () => {
        setLoading(true);
        try {
            const absences = await getAbsences();
            const notRemoved = absences.filter((absence) => !absence.removeAt);
            if (isHR !== "HR") {
                const userAbsences = notRemoved.filter((absence) => absence.employeeId._id === userId);
                setAllAbsences(userAbsences);
            } else {
                setAllAbsences(notRemoved);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUsers = async () => {
        try {
            const users = await getUsers();
            const notRemoved = users.filter((user) => !user.removeAt);
            if (isHR !== "HR") {
                const userLoggedId = notRemoved.filter((user) => user._id === userId);
                setAllUsers(userLoggedId[0]);
            } else {
                setAllUsers(notRemoved);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const openCreateAbsence = () => {
        setOpenEdit(true);
        setSelectedAbsence(null);
    };

    const onSearch = (value, _e, info) => {
        console.log(info?.source, "valor: ", value);
        const newList = [...allAbsences];
        if (info) {
            const filteredData = newList.filter(
                (info) =>
                    info.employeeId.name
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.employeeId.surname
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.country
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.city
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.absenceService
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    info.absenceCode
                        ?.toLowerCase()
                        .includes(value.toLowerCase())
            );
            if (filteredData.length !== 0) return setFiltering(filteredData);
            if (filteredData.length === 0) {
                message.success('No hay datos de filtro')
            }
        }
        if (!info) allAbsences;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-dvh">
                <Spin size="large" />
            </div>
        );
    }

    const continents = ["America", "Europa", "Africa", "Asia", "Oceania"];

    return (
        <>
            <Flex wrap justify="space-between" align="flex-start">
                <div className="title-box">
                    <h1 className="title">Lista de viajes</h1>
                    <h2 className="subtitle">Listado de todos los viajes por cada continente</h2>
                </div>
            </Flex>
            <div className="flex justify-between items-center my-5">
                <div className="flex justify-start my-5">
                    <Button type="primary" onClick={openCreateAbsence}>
                        Crear viaje
                    </Button>
                </div>
                <isindex />
                {isHR === "HR" ?
                    <div className="flex justify-end my-5 pr-16">
                        <Search
                            placeholder="Buscar por empleado..."
                            allowClear
                            enterButton="Buscar"
                            style={{ width: 300 }}
                            onSearch={onSearch}
                        />
                    </div> : null}
            </div>
            <Space>
                <AbsenceModal
                    visible={openEdit}
                    onCancel={() => setOpenEdit(false)}
                    allUsers={allUsers}
                    refresh={refresh}
                    absence={selectedAbsence}
                />
            </Space>
            <Space wrap size={16} align="start">
                {continents.map((continent) => {
                    const continentAbsences =
                        filtering.length !== 0 ?
                            filtering.filter(ausencia => ausencia.continent === continent) :
                            allAbsences.filter(ausencia => ausencia.continent === continent);
                    return continentAbsences.length > 0 ? (
                        <Card
                            key={continent}
                            title={continent}
                            style={{ width: 430 }}
                        >
                            {continentAbsences.map((ausencia, index) => (
                                <div key={index}>
                                    <AbsencesCard
                                        ausencia={ausencia}
                                        id={ausencia._id}
                                        refresh={refresh}
                                        visible={setOpenEdit}
                                        absence={setSelectedAbsence}
                                    />
                                </div>
                            ))}
                        </Card>
                    ) : null;
                })}
            </Space>
        </>
    );
};

export default Absences;
