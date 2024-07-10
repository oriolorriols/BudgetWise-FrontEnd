const baseUrl = import.meta.env.VITE_BACKEND;

export const getAbsences = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/absences`, {
        headers: { authorization: `Bearer ${token}` }, // ponemos en headers el token generado
    });
    const absences = await response.json();
    return absences;
};

export const getOneAbsence = async (id) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/absences/${id}`, {
        headers: { authorization: `Bearer ${token}` },
    });
    const absences = await response.json();
    return absences;
};

export const addAbsences = async (data) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/absences`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
    });
    const newAbsences = await response.json();
    return newAbsences;
};

export const deleteAbsences = async (id) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/absences/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
    });
    const absencesDeleted = await response.json();
    return absencesDeleted;
};

export const updateAbsences = async (id, data) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/absences/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    });
    const absencesUpdated = await response.json();
    return absencesUpdated;
};
