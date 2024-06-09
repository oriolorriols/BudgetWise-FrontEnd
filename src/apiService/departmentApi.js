const baseUrl = "http://localhost:3000"

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
