import { useEffect, useState } from "react";
import { getAbsences } from "../../apiService/absencesApi";
import { Button, Card, Space, Flex, Select, Spin } from 'antd';
import AbsencesCard from "./absenceCards";
import AbsenceModal from "../../components/modals/modalAbsences";
import { getUsers } from "../../apiService/userApi";
import { useAuth } from "../../contexts/authContext"

const Absences = () => {
    const [allAbsences, setAllAbsences] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [dummy, refresh] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const { userId, isHR } = useAuth()
    const [selectedAbsence, setSelectedAbsence] = useState(null);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        getAllAbsences();
        getAllUsers();
        console.log("all users useEffect Absence.jsx ", allUsers)
    }, [dummy, userId]);

    const getAllAbsences = async () => {
        setLoading(true)
        try {
            const absences = await getAbsences();
            const notRemoved = absences.filter((absence) => !absence.removeAt);
            if (isHR !== "HR") {
                const userAbsences = notRemoved.filter((absence) => absence.employeeId._id === userId)
                setAllAbsences(userAbsences)
            } else {
                setAllAbsences(notRemoved)
            }
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUsers = async () => {
        try {
            const users = await getUsers();
            const notRemoved = users.filter((user) => !user.removeAt);
            if (isHR !== "HR") {
                const userLoggedId = notRemoved.filter((user) => user._id === userId)
                setAllUsers(userLoggedId[0])
            } else {
                setAllUsers(notRemoved)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const openCreateAbsence = () => {
        setOpenEdit(true);
        setSelectedAbsence(null)
    }

    const onSearch = (value, _e, info) => {
        console.log(info?.source, "voy escribiendo y cambio busqueda de opciones (filtro wrap)", value);
    }

    const filteredUsers = (value, _e, info) => {
        console.log(info?.source, "click en buscar en viajes (filtro cards)", value);
    }

    if (loading) {
        return (
          <div className="flex justify-center items-center h-dvh">
            <Spin size="large" />
          </div>
        )
      }

    return (
        <>
            <Flex wrap justify="space-between" align="flex-start">
                <div className="title-box">
                    <h1 className='title'>Lista de viajes</h1>
                    <h2 className='subtitle'>Listado de todos los viajes por cada continente</h2>
                </div>
            </Flex>
            <div className="flex justify-between items-center my-5">
                <div className="flex justify-start my-5">
                    <Button type="primary" onClick={openCreateAbsence}>
                        Crear viaje
                    </Button>
                </div>
                <div className="flex justify-end my-5 pr-16">
                    {isHR === "HR" ?
                        <Select
                            showSearch
                            style={{ width: 300 }}
                            placeholder="Buscar por empleado..."
                            optionFilterProp="label"
                            allowClear
                            onChange={filteredUsers}
                            onSearch={onSearch}
                        >
                            {allUsers?.map((user) => (
                                <Option key={user._id} value={user._id}>
                                    {user.name} {user.surname}
                                </Option>
                            ))
                            }
                        </Select>
                        : null}
                </div>
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
                <Card
                    title="América"
                    style={{
                        width: 430,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "America" &&
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
                <Card
                    title="Europa"
                    style={{
                        width: 430,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "Europa" &&
                        <div key={index}>
                            <AbsencesCard
                                ausencia={ausencia}
                                id={ausencia._id}
                                refresh={refresh}
                                visible={setOpenEdit}
                                absence={setSelectedAbsence} />
                        </div>
                    ))}
                </Card>
                <Card
                    title="Africa"
                    style={{
                        width: 430,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "Africa" &&
                        <div key={index}>
                            <AbsencesCard
                                ausencia={ausencia}
                                id={ausencia._id}
                                refresh={refresh}
                                visible={setOpenEdit}
                                absence={setSelectedAbsence} />
                        </div>
                    ))}
                </Card>
                <Card
                    title="Asia"
                    style={{
                        width: 430,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "Asia" &&
                        <div key={index}>
                            <AbsencesCard
                                ausencia={ausencia}
                                id={ausencia._id}
                                refresh={refresh}
                                visible={setOpenEdit}
                                absence={setSelectedAbsence} v />
                        </div>
                    ))}
                </Card>
                <Card
                    title="Oceania"
                    style={{
                        width: 430,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "Oceania" &&
                        <div key={index}>
                            <AbsencesCard
                                ausencia={ausencia}
                                id={ausencia._id}
                                refresh={refresh}
                                visible={setOpenEdit}
                                absence={setSelectedAbsence} />
                        </div>
                    ))}
                </Card>
            </Space >
        </>
    );
};

export default Absences;
