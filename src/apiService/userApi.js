const baseUrl = import.meta.env.BACKEND

export const getUsers = async () => {
    const token = localStorage.getItem("access_token")
    const response = await fetch(`${baseUrl}/users`, {
        headers: {"authorization": `Bearer ${token}`} // ponemos en headers el token generado
    })
    const users = await response.json();
    return users
}

export const getOneUser = async (id) => {
    const token = localStorage.getItem("access_token")
    const response = await fetch(`${baseUrl}/users/${id}`,{
    headers: {"authorization": `Bearer ${token}`}
    })
    const user = await response.json();
    return user
}

export const createUser = async (userData) => {
    const token = localStorage.getItem("access_token")
    const response = await fetch(`${baseUrl}/users/create`, {
        method: 'POST', 
        body: JSON.stringify(userData), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const newUser = await response.json();
    return newUser
}

export const deleteUser = async (id) => {
    const token = localStorage.getItem("access_token")
    const response = await fetch(`${baseUrl}/users/${id}`, {
        method: 'DELETE', 
        headers: {"authorization": `Bearer ${token}`}})
    const deletedUser = await response.json();
    return deletedUser
}

export const updateUser = async (id, userData) => {
    const token = localStorage.getItem("access_token")
    const response = await fetch(`${baseUrl}/users/${id}`, {
        method: 'PUT', 
        body: JSON.stringify(userData), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const changedUser = await response.json();
    console.log(changedUser)
    return changedUser
}

export const updateUserPic = async (userPic) => {
    const token = localStorage.getItem("access_token")
    const formData = new FormData();
    formData.append("file", userPic);
    try {
        const response = await fetch(`${baseUrl}/upload/user`, {
            method: 'POST', 
            body: formData, 
            headers: {"authorization": `Bearer ${token}`}
        })
        const changedUser = await response.json();
        console.log(changedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        throw error
    }
}

export const login = async (email, password) => {
    const token = localStorage.getItem("access_token")
    const response = await fetch(`${baseUrl}/users/login`, {
        method: 'POST', 
        body: JSON.stringify({email, password}), 
        headers: {"Content-Type": "application/json"}
    })
    const logged = await response.json();
    return logged
}
