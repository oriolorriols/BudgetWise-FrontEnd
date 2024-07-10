import { Button, Card, Carousel, Popconfirm, Space } from 'antd';
// import { useEffect, useState } from "react";
import './absence.scss';
import { deleteAbsences } from '../../apiService/absencesApi';

const AbsencesCard = ({ name, surname, absenceName, startDate, endDate, country, city, absenceService, absenceCode, id, refresh, visible }) => {

    const handleDelete = async (id) => {
        await deleteAbsences(id);
        refresh((prev) => !prev);
    };

    const editExpense = (id) => {
        console.log("Edito id: ", id)
        refresh((prev) => !prev);
        visible((prev) => !prev);
    }

    return (
        < Card hoverable className="cardStyle" >
            <Carousel arrows >
                <div className="mb-0">
                    <h1 className="contentStyle"><strong>Empleado: </strong>{name} {surname}</h1>
                    <h1 className="contentStyle"><strong>Título: </strong>{absenceName}</h1>
                </div>
                <div>
                    <h1 className="contentStyle"><strong>Fecha de inicio: </strong>{startDate.split("T")[0]}</h1>
                    <h1 className="contentStyle"><strong>Fecha de fin: </strong>{endDate.split("T")[0]}</h1>
                </div>
                <div>
                    <h1 className="contentStyle"><strong>País: </strong>{country}</h1>
                    <h1 className="contentStyle"><strong>Ciudad: </strong>{city}</h1>
                </div>
                <div>
                    <h1 className="contentStyle"><strong>Servicio: </strong>{absenceService}</h1>
                    <h1 className="contentStyle"><strong>Código de venta: </strong>{absenceCode ? absenceCode : "-"}</h1>
                </div>
            </Carousel>
            <Space >
                <Button className="ml-16 button">
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(id)}
                    >
                        <a>Eliminar</a>
                    </Popconfirm>
                </Button>
                <Button className="mr-16 button" onClick={() => editExpense(id)}>
                    <a>Editar</a>
                </Button>
            </Space>
        </Card >
    )
}

export default AbsencesCard;