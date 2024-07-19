import { Button, Card, Carousel, Popconfirm, Space, message } from 'antd';
import './absence.scss';
import { deleteAbsences } from '../../apiService/absencesApi';

const AbsencesCard = ({ ausencia, id, refresh, visible, absence }) => {

    const handleDelete = async (id) => {
        await deleteAbsences(id);
        message.success('Viaje eliminado con éxito')
        refresh((prev) => !prev);
    };

    const editExpense = (id) => {
        console.log("Edito id: ", id)
        absence((prev) => id)
        visible((prev) => !prev);
    }

    return (
        < Card hoverable className="cardStyle" >
            <Carousel arrows >
                <div className="mb-0">
                    <h1 className="contentStyle"><strong>Empleado: </strong>{ausencia.employeeId?.name} {ausencia.employeeId?.surname}</h1>
                    <h1 className="contentStyle"><strong>Título: </strong>{ausencia.absenceName}</h1>
                </div>
                <div>
                    <h1 className="contentStyle"><strong>Fecha de inicio: </strong>{ausencia.startDate.split("T")[0]}</h1>
                    <h1 className="contentStyle"><strong>Fecha de fin: </strong>{ausencia.endDate.split("T")[0]}</h1>
                </div>
                <div>
                    <h1 className="contentStyle"><strong>País: </strong>{ausencia.country}</h1>
                    <h1 className="contentStyle"><strong>Ciudad: </strong>{ausencia.city}</h1>
                </div>
                <div>
                    <h1 className="contentStyle"><strong>Servicio: </strong>{ausencia.absenceService}</h1>
                    <h1 className="contentStyle"><strong>Código de venta: </strong>{ausencia.absenceCode ? ausencia.absenceCode : "-"}</h1>
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