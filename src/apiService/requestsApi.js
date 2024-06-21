const baseUrl = import.meta.env.BACKEND

export const getRequests = async () => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/requests`, {
        headers: {"authorization": `Bearer ${token}`} // ponemos en headers el token generado
    })
    const requests = await response.json();
    return requests
}

export const getOneRequest = async (id) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/requests/${id}`, {"authorization": `Bearer ${token}`})
    const requests = await response.json();
    return requests
}

export const deleteRequests = async (id) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/requests/${id}`, {method: 'DELETE', headers: {"authorization": `Bearer ${token}`}})
    const requestDeleted = await response.json();
    return requestDeleted
}

export const updateRequests = async (id, data) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/requests/${id}`, {
        method: 'PUT', 
        body: JSON.stringify(data), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const requestUpdated = await response.json();
    return requestUpdated
}
