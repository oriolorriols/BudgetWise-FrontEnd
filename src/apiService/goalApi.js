const baseUrl = import.meta.env.VITE_BACKEND

export const getGoals = async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${baseUrl}/goals`, {
        headers: { "authorization": `Bearer ${token}` }
    });
    const goals = await response.json();
    return goals;
};

export const addGoalForDepartment = async (data) => {
    console.log(data)
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${baseUrl}/goals/department`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}` }
    });
    const newGoal = await response.json();
    console.log(newGoal)
    return newGoal;
};

export const deleteGoal = async (id) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/goals/${id}`, {
        method: 'DELETE', 
        headers: {"authorization": `Bearer ${token}`}
    })
    const goalDeleted = await response.json();
    return goalDeleted
}

export const updateGoal = async (id, data) => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${baseUrl}/goals/${id}`, {
        method: 'PUT', 
        body: JSON.stringify(data), 
        headers: {"Content-Type": "application/json", "authorization": `Bearer ${token}`}
    })
    const goalUpdated = await response.json();
    console.log(goalUpdated)
    return goalUpdated
}