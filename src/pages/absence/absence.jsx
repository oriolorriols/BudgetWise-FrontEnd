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
    const { userLoged, setUserLoged } = useState({})

    const getAllAbsences = async () => {
        console.log()
        const absences = await getAbsences();
        const notRemoved = absences.filter((absence) => !absence.removeAt);
        if (absences.length) setAllAbsences(notRemoved);
        else setError(absences.message);
    };

    const getAllUsers = async () => {
        const users = await getUsers();
        const notRemoved = users.filter((user) => !user.removeAt);
        if (users.length) setAllUsers(notRemoved);
        else setError(users.message);
    };

    const getLogedUser = async () => {
        const data = await getOneUser(userId)
        setUserLoged(data)
        console.log("cargando usuario en get loged user")
    }

    useEffect(() => {
        if (userId && isHR !== "HR") {
            getLogedUser();
            console.log("funciona get loged user en sue effect si no eres HR")
        }
        getAllAbsences();
        getAllUsers();
        console.log(userLoged)
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
                    idUser={userLoged}
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
