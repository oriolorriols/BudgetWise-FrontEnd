const baseUrl = import.meta.env.VITE_BACKEND;

export const getExpenses = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/expenses`, {
        headers: { "authorization": `Bearer ${token}` }, // ponemos en headers el token generado
    });
    const expenses = await response.json();
    return expenses;
};

export const getOneExpense = async (id) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/expenses/${id}`, {
        headers: { "authorization": `Bearer ${token}` },
    });
    const expenses = await response.json();
    return expenses;
};

export const addExpenses = async (data) => {
    const token = localStorage.getItem("access_token");
    // const formData = new FormData();
    // for (let i = 0; i < expenseProof.length; i++) {
    //     formData.append("files", expenseProof[i]);
    // }
    // formData.append("data", JSON.stringify(data));
    const response = await fetch(`${baseUrl}/expenses`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
    });
    const newExpenses = await response.json();
    return newExpenses;
};

export const deleteExpenses = async (id) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/expenses/${id}`, {
        method: "DELETE",
        headers: { "authorization": `Bearer ${token}` },
    });
    const expensesDeleted = await response.json();
    return expensesDeleted;
};

export const updateExpenses = async (id, data) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
    });
    const expensesUpdated = await response.json();
    return expensesUpdated;
};

export const emailExpenses = async (id, data) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/expenses/${id}/sending`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
    });
    const expenses = await response.json();
    return expenses;
};

export const approvedExpenses = async (id, data) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/expenses/${id}/approving`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
    });
    const expenses = await response.json();
    return expenses;
};
