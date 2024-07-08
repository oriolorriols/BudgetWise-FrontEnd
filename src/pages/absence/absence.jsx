import { useEffect, useState } from "react";
import { getAbsences } from "../../apiService/absencesApi";
import { Button, Card, Carousel, Collapse, Empty, Space } from 'antd';

const Absences = () => {
    const [allAbsences, setAllAbsences] = useState([]);
    const [dummy, refresh] = useState(false);

    const getAllAbsences = async () => {
        const absences = await getAbsences();
        const notRemoved = absences.filter((absence) => !absence.removeAt);
        if (absences.length) setAllAbsences(notRemoved);
        else setError(absences.message);
    };

    useEffect(() => {
        getAllAbsences();
    }, [dummy]);

    const contentStyle = {
        height: "40px",
        lineHeight: "14px",
        margin: 0,
        color: '#000000',
        textAlign: 'start',
        padding: 0,
    };

    const cardStyle = {
        padding: 0,
        height: "110px",
        marginBottom: 8,
        background: "rgba(0, 0, 0, 0.1)",
    }

    const addAbsence = () => {
        console.log("Creando")
    }

    return (
        <>
            <div className="flex justify-start my-5">
                <Button type="primary" onClick={addAbsence}>
                    Crear viaje
                </Button>
            </div>
            <Space wrap size={16} align="start">
                <Card
                    title="América"
                    style={{
                        width: 400,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "America" ?
                        <div key={index}>
                            <Card hoverable style={cardStyle}>
                                <Carousel arrows >
                                    <div className="mb-0">
                                        <h1 style={contentStyle}><strong>Nombre: </strong>{ausencia.employeeId.name} {ausencia.employeeId.surname}</h1>
                                        <h1 style={contentStyle}><strong>Título: </strong>{ausencia.absenceCodeId.absenceName}</h1>
                                    </div>
                                    <div>
                                        <h3 style={contentStyle}>Prueba</h3>
                                        <h3 style={contentStyle}>de Carrusel</h3>
                                    </div>
                                </Carousel>
                            </Card>
                        </div>
                        : null))}
                </Card>
                <Card
                    title="Europa"
                    style={{
                        width: 400,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "Europa" ?
                        <div key={index}>
                            <Card hoverable style={cardStyle}>
                                <Carousel arrows >
                                    <div>
                                        <h1 style={contentStyle}><strong>Nombre: </strong> {ausencia.employeeId.name} {ausencia.employeeId.surname}</h1>
                                        <h1 style={contentStyle}><strong>Título: </strong> {ausencia.absenceCodeId.absenceName}</h1>
                                    </div>
                                    <div >
                                        <h3 style={contentStyle}>Prueba</h3>
                                        <h3 style={contentStyle}>de Carrusel</h3>
                                    </div>
                                </Carousel>
                            </Card>
                        </div>
                        : null))}
                </Card>
                <Card
                    title="Africa"
                    style={{
                        width: 400,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "Africa" ?
                        <div key={index}>
                            <Card hoverable style={cardStyle}>
                                <Carousel arrows >
                                    <div>
                                        <h1 style={contentStyle}><strong>Nombre: </strong>{ausencia.employeeId.name} {ausencia.employeeId.surname}</h1>
                                        <h1 style={contentStyle}><strong>Título: </strong>{ausencia.absenceCodeId.absenceName}</h1>
                                    </div>
                                    <div >
                                        <h3 style={contentStyle}>Prueba</h3>
                                        <h3 style={contentStyle}>de Carrusel</h3>
                                    </div>
                                </Carousel>
                            </Card>
                        </div>
                        : null))}
                </Card>
                <Card
                    title="Asia"
                    style={{
                        width: 400,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "Asia" ?
                        <div key={index}>
                            <Card hoverable style={cardStyle}>
                                <Carousel arrows >
                                    <div>
                                        <h1 style={contentStyle}><strong>Nombre: </strong>{ausencia.employeeId.name} {ausencia.employeeId.surname}</h1>
                                        <h1 style={contentStyle}><strong>Título: </strong>{ausencia.absenceCodeId.absenceName}</h1>
                                    </div>
                                    <div >
                                        <h3 style={contentStyle}>Prueba</h3>
                                        <h3 style={contentStyle}>de Carrusel</h3>
                                    </div>
                                </Carousel>
                            </Card>
                        </div>
                        : null))}
                </Card>
                <Card
                    title="Oceania"
                    style={{
                        width: 400,
                    }}
                >
                    {allAbsences.map((ausencia, index) => (ausencia.continent === "Oceania" ?
                        <div key={index}>
                            <Card hoverable style={cardStyle}>
                                <Carousel arrows >
                                    <div>
                                        <h1 style={contentStyle}><strong>Nombre: </strong>{ausencia.employeeId.name} {ausencia.employeeId.surname}</h1>
                                        <h1 style={contentStyle}><strong>Título: </strong>{ausencia.absenceCodeId.absenceName}</h1>
                                    </div>
                                    <div >
                                        <h3 style={contentStyle}>Prueba</h3>
                                        <h3 style={contentStyle}>de Carrusel</h3>
                                    </div>
                                </Carousel>
                            </Card>
                        </div>
                        : null))}
                </Card>
            </Space >
        </>
    );
};

export default Absences;
