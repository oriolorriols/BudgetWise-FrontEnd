const baseUrl = "http://localhost:3000"

export const getUsers = async () => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/users`, {
        headers: {"authorization": `Bearer ${token}`} // ponemos en headers el token generado
    })
    const usuarios = await response.json();
    return usuarios
}

export const getOneUser = async (id) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/users/${id}`, {"authorization": `Bearer ${token}`})
    const usuario = await response.json();
    return usuario
}

export const addUsuario = async (userData) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/users`, {
        method: 'POST', 
        body: JSON.stringify(userData), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const newUsuario = await response.json();
    return newUsuario
}

export const deleteUser = async (id) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/users/${id}`, {method: 'DELETE', headers: {"authorization": `Bearer ${token}`}})
    const usuarioEliminado = await response.json();
    return usuarioEliminado
}

export const updateUser = async (id, userData) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/users/${id}`, {
        method: 'PUT', 
        body: JSON.stringify(userData), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const usuarioCambiado = await response.json();
    return usuarioCambiado
}

export const login = async (email, password) => {
    const response = await fetch(`${baseUrl}/users/login`, {
        method: 'POST', 
        body: JSON.stringify({email, password}), 
        headers: {"Content-Type": "application/json"}
    })
    const inicio = await response.json();
    return inicio
}
