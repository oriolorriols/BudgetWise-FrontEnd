import { useEffect, useState } from "react";
import { getAbsences } from "../../apiService/absencesApi";
import { Button, Card, Space, Flex } from 'antd';
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

    useEffect(() => {
        getAllAbsences();
        getAllUsers();
        console.log("all users useEffect Absence.jsx ", allUsers)
    }, [dummy, userId]);

    const getAllAbsences = async () => {
        try {
            const absences = await getAbsences();
            const notRemoved = absences.filter((absence) => !absence.removeAt);
            if (isHR !== "HR") {
                const userAbsences = notRemoved.filter((absence) => absence.employeeId._id === userId)
                setAllAbsences(userAbsences)
            } else {
                setAllAbsences(notRemoved)
            }
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
        console.log("Abre modal de crear")
    }

    return (
        <>
            <Flex wrap justify="space-between" align="flex-start">
                <div className="title-box">
                    <h1 className='title'>Lista de viajes</h1>
                    <h2 className='subtitle'>Listado de todos los viajes por cada continente</h2>
                </div>
            </Flex>
            <div className="flex justify-start my-5">
                <Button type="primary" onClick={openCreateAbsence}>
                    Crear viaje
                </Button>
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
