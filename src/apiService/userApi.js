const baseUrl = "http://localhost:3000"

export const getUsers = async () => {
    const token = localStorage.getItem('acces_token')
    const response = await fetch(`${baseUrl}/user`, {
        headers: {"authorization": `Bearer ${token}`} // ponemos en headers el token generado
    })
    const usuarios = await response.json();
    return usuarios
}

export const getOneUser = async (id) => {
    const response = await fetch(`${baseUrl}/user/${id}`)
    const usuario = await response.json();
    return usuario
}

export const addUsuario = async (userData) => {
    const response = await fetch(`${baseUrl}/user`, {
        method: 'POST', 
        body: JSON.stringify(userData), 
        headers: {"Content-Type": "application/json"}
    })
    const newUsuario = await response.json();
    return newUsuario
}

export const deleteUser = async (id) => {
    const response = await fetch(`${baseUrl}/user/${id}`, {method: 'DELETE'})
    const usuarioEliminado = await response.json();
    return usuarioEliminado
}

export const updateUser = async (id, userData) => {
    const response = await fetch(`${baseUrl}/user/${id}`, {
        method: 'PUT', 
        body: JSON.stringify(userData), 
        headers: {"Content-Type": "application/json"}
    })
    const usuarioCambiado = await response.json();
    return usuarioCambiado
}
