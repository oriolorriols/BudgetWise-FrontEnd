const baseUrl = "http://localhost:3000"

export const getTasks = async () => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/tasks`, {
        headers: {"authorization": `Bearer ${token}`}
    })
    const tasks = await response.json();
    return tasks
}

export const getUserTasks = async (userId) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/tasks/user/${userId}`, {
        headers: {"authorization": `Bearer ${token}`}
    })
    const tasks = await response.json();
    return tasks
}

export const getOneTask = async (id) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/tasks/${id}`, {
        headers: {"authorization": `Bearer ${token}`}
    })
    const task = await response.json();
    return task
}

export const addTask = async (data) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/tasks`, {
        method: 'POST', 
        body: JSON.stringify(data), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const newTask = await response.json();
    return newTask
}

export const deleteTask = async (id) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/tasks/${id}`, {
        method: 'DELETE', 
        headers: {"authorization": `Bearer ${token}`}
    })
    const taskDeleted = await response.json();
    return taskDeleted
}

export const updateTask = async (id, data) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/tasks/${id}`, {
        method: 'PUT', 
        body: JSON.stringify(data), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const taskUpdated = await response.json();
    return taskUpdated
}
