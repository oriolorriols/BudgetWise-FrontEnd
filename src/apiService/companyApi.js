const baseUrl = "http://localhost:3000"

export const getCompany = async (id) => {
    const token = localStorage.getItem("access_token")

    try {
        const response = await fetch(`${baseUrl}/companies/${id}`, {
            headers: {"authorization": `Bearer ${token}`}
        })
        const company = await response.json()
        return company
    }
    catch (error) {
        console.error('Error getting Company', error)
        throw error
    }
}


export const updateUserPic = async (userPic) => {
    const token = localStorage.getItem("access_token")

    const formData = new FormData();
    formData.append("file", userPic);

    try {
        const response = await fetch(`${baseUrl}/upload/`, {
            method: 'POST', 
            body: formData, 
            headers: {"authorization": `Bearer ${token}`}
        })
        const changedUser = await response.json();
        console.log(changedUser)
        return changedUser
    } catch (error) {
        console.error('Error updating user:', error)
        throw error
    }
}


