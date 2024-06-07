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


export const updateCompanyLogo = async (companyLogo, id) => {
    const token = localStorage.getItem("access_token")

    const formData = new FormData();
    formData.append("file", companyLogo);

    try {
        const response = await fetch(`${baseUrl}/upload/company/${id}`, {
            method: 'POST', 
            body: formData, 
            headers: {"authorization": `Bearer ${token}`}
        })
        const companyLogoURL = await response.json();
        console.log(companyLogoURL)
        return companyLogoURL
    } catch (error) {
        console.error('Error updating user:', error)
        throw error
    }
}


