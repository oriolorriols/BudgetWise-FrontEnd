const baseUrl = "http://localhost:3000"

export const getUsers = () => {
    return fetch(`${baseUrl}/user`).then(res => res.json())
}