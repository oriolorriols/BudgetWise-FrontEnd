const baseUrl = import.meta.env.BACKEND

export const getDepartments = async () => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/departments`, {
        headers: {"authorization": `Bearer ${token}`}
    })
    const departments = await response.json();
    return departments
}


export const updateDepartment = async (id, data) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/departments/${id}`, {
        method: 'PUT', 
        body: JSON.stringify(data), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const expensesUpdated = await response.json();
    return expensesUpdated
}


export const createDepartment = async (userData) => {
    const token = localStorage.getItem("access_token")
    const response = await fetch(`${baseUrl}/departments`, {
        method: 'POST', 
        body: JSON.stringify(userData), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const newDepartment = await response.json();
    return newDepartment
}


export const deleteDepartment = async (id) => {
    const token = localStorage.getItem("access_token")
    const response = await fetch(`${baseUrl}/departments/${id}`, {
        method: 'DELETE', 
        headers: {"authorization": `Bearer ${token}`}})
    const deletedDepartment = await response.json();
    return deletedDepartment
}
