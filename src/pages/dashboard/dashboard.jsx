import React, { useEffect, useState } from 'react'
import { useAuth } from "../../contexts/authContext"
import { getOneUser } from '../../apiService/userApi'
import TokenModal from '../../components/modals/modalToken'
import ExpenseModal from '../../components/modals/modalExpenses'
import { Flex, Progress, Button, Modal } from 'antd'

const Dashboard = () => {
  const { userId } = useAuth()
  const [isModalTokenVisible, setIsModalTokenVisible] = useState(false)
  const [isModalExpensesVisible, setModalExpensesVisible] = useState(false)
  const [user, setUser] = useState(null)

  const getUserData = async () => {
    try {
      const data = await getOneUser(userId)
      setUser(data)
      if ((data.error && data.error.name === "TokenExpiredError") || localStorage.getItem("access_token") === null) {
        setIsModalTokenVisible(true)
      } 
    } catch (error) {
      console.error("Failed to fetch user data", error)
    }
  }

  useEffect(() => {
    getUserData()
  }, [userId])

  const twoColors = {
    '0%': '#108ee9',
    '100%': '#87d068',
  }

  return (
    <>
      <TokenModal
        visible={isModalTokenVisible}
      />
      <ExpenseModal 
        visible={isModalExpensesVisible}
        onCancel={() => setModalExpensesVisible(false)}/>
      <div>
        <h2 className='font-medium text-2xl'>Hola, {user?.name}!</h2>
        <Button onClick={() => setModalExpensesVisible(true)} >Añadir gasto</Button>
      </div>

      <div className='flex'>

        <div className="flex bg-cyan-950 text-white w-fit rounded-lg px-5 py-4 m-3"> 
          <img src="https://cdn-icons-png.flaticon.com/512/482/482541.png" width="50px" alt="" />
          <div className='ml-3'>
            <h3>Gastos</h3>
            <p className='font-bold'>1.388,25€</p>
          </div>
        </div>

        <div className="flex bg-cyan-950 text-white w-fit rounded-lg px-5 py-4 m-3"> 
          <img src="https://cdn-icons-png.flaticon.com/512/482/482541.png" width="50px" alt="" />
          <div className='ml-3'>
            <h3>Acomulado año</h3>
            <p className='font-bold'>3.388,25€</p>
          </div>
        </div>

        <div className="flex bg-cyan-950 text-white w-fit rounded-lg px-5 py-4 m-3"> 
          <img src="https://cdn-icons-png.flaticon.com/512/482/482541.png" width="50px" alt="" />
          <div className='ml-3'>
            <h3>Gasto medio mes</h3>
            <p className='font-bold'>503€</p>
          </div>
        </div>

      </div>




      <Flex vertical="true" gap="middle">
        <Flex gap="small" wrap="true">
          <Progress type="dashboard" percent={90} strokeColor={twoColors} />
          <Progress type="dashboard" percent={100} strokeColor={twoColors} />
        </Flex>
      </Flex>
    </>
  )
}

export default Dashboard
