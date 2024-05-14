import { useEffect, useState } from "react";
import { getExpenses } from "../../apiService/expensesApi";

const Expenses = () => {
    const [allExpenses, setAllExpenses] = useState([])
    const [error, setError] = useState("")
    const [dummy, refresh] = useState(false)
    
    const getAllExpenses = async () => {
        const expenses = await getExpenses();
        if (expenses.length) setAllExpenses(expenses);
        else setError(expenses.message)
    }
    
    useEffect(() => {
        getAllExpenses()
    }, [dummy]);

    return (
    <>
    <h1>Todos los gastos</h1>
    {allExpenses.map((expense, index) => (
        <div key={index}>
            <h1>{expense.expenseDate}</h1>
            <h1>{expense.paymentMethod}</h1>
        </div>
        ))}
    {error && <p>Ha habido un error: {error}</p>}
    </>
    )}
    
export default Expenses;