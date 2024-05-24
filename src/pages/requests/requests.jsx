import { useEffect, useState } from "react";
import { getRequests } from "../../apiService/requestsApi";

const Requests = () => {
    const [requests, setRequests] = useState([])
    const [error, setError] = useState("")
    const [dummy, refresh] = useState(false)
    
    const getAllRequests = async () => {
        const requests = await getRequests();
        if (requests.length) setRequests(requests);
        else setError(requests.message)
    }
    
    useEffect(() => {
        getAllRequests()
    }, [dummy]);

    return (
    <>
    <h1>Todas las solicitudes: viajes-ausencias y gastos</h1>
    <h1>{requests}</h1>
    {error && <p>Ha habido un error: {error}</p>}
    </>
    )}
    
export default Requests;