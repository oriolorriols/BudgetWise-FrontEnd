import { useEffect, useState } from "react";
import { getAbsences } from "../../apiService/absencesApi";
import { Button, Card, Space, Flex } from 'antd';
import AbsencesCard from "./absenceCards";
import AbsenceModal from "../../components/modals/modalAbsences";
import { getOneUser, getUsers } from "../../apiService/userApi";
import { useAuth } from "../../contexts/authContext"

const Absences = () => {
    const [allAbsences, setAllAbsences] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [dummy, refresh] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const { userId, isHR } = useAuth()
    const { userLogged, setUserLogged } = useState({})

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
            setError(error.message);
        }
    };

    const getAllUsers = async () => {
        const users = await getUsers();
        const notRemoved = users.filter((user) => !user.removeAt);
        if (users.length) setAllUsers(notRemoved);
        else setError(users.message);
    };

    const getLoggedUser = async () => {
        const data = await getOneUser(userId)
        try {
            setUserLogged(data)
            console.log("cargando usuario en get logged user")
        } catch (error) {
            console.error("Error fetching logged user: ", error)
        }
    }

    useEffect(() => {
        if (userId) {
            if (isHR !== "HR") {
                getLoggedUser();
                console.log("funciona get logged user en sue effect si no eres HR")
            }
            getAllAbsences();
            getAllUsers();
            console.log(userLogged)
        }
    }, [dummy, userId]);

    const openCreateAbsence = () => {
        setOpenEdit(true);
        console.log("Abre modal")
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
                    idUser={userLogged}
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
                                name={ausencia.employeeId.name}
                                surname={ausencia.employeeId.surname}
                                absenceName={ausencia.absenceName}
                                startDate={ausencia.startDate}
                                endDate={ausencia.endDate}
                                country={ausencia.country}
                                city={ausencia.city}
                                absenceService={ausencia.absenceService}
                                absenceCode={ausencia.absenceCode}
                                id={ausencia._id}
                                refresh={refresh}
                                visible={setOpenEdit}
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
                                name={ausencia.employeeId.name}
                                surname={ausencia.employeeId.surname}
                                absenceName={ausencia.absenceName}
                                startDate={ausencia.startDate}
                                endDate={ausencia.endDate}
                                country={ausencia.country}
                                city={ausencia.city}
                                absenceService={ausencia.absenceService}
                                absenceCode={ausencia.absenceCode}
                                id={ausencia._id}
                                refresh={refresh}
                                visible={setOpenEdit} />
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
                                name={ausencia.employeeId.name}
                                surname={ausencia.employeeId.surname}
                                absenceName={ausencia.absenceName}
                                startDate={ausencia.startDate}
                                endDate={ausencia.endDate}
                                country={ausencia.country}
                                city={ausencia.city}
                                absenceService={ausencia.absenceService}
                                absenceCode={ausencia.absenceCode}
                                id={ausencia._id}
                                refresh={refresh}
                                visible={setOpenEdit} />
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
                                name={ausencia.employeeId.name}
                                surname={ausencia.employeeId.surname}
                                absenceName={ausencia.absenceName}
                                startDate={ausencia.startDate}
                                endDate={ausencia.endDate}
                                country={ausencia.country}
                                city={ausencia.city}
                                absenceService={ausencia.absenceService}
                                absenceCode={ausencia.absenceCode}
                                id={ausencia._id}
                                refresh={refresh}
                                visible={setOpenEdit} />
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
                                name={ausencia.employeeId.name}
                                surname={ausencia.employeeId.surname}
                                absenceName={ausencia.absenceName}
                                startDate={ausencia.startDate}
                                endDate={ausencia.endDate}
                                country={ausencia.country}
                                city={ausencia.city}
                                absenceService={ausencia.absenceService}
                                absenceCode={ausencia.absenceCode}
                                id={ausencia._id}
                                refresh={refresh}
                                visible={setOpenEdit} />
                        </div>
                    ))}
                </Card>
            </Space >
        </>
    );
};

export default Absences;
