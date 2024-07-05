import { useEffect, useState } from "react";
import { getAbsences } from "../../apiService/absencesApi";

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

    return (
        <>
            <h1>Ausencias de viajes, vacaciones, etc</h1>
            {allAbsences.map((ausencia, index) => (
                <div key={index}>
                    <h1>{ausencia.country}</h1>
                    <h1>{ausencia.city}</h1>
                </div>
            ))}
        </>
    );
};

export default Absences;
