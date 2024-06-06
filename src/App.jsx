import {  Routes, Route, Navigate } from "react-router-dom"

import Home from "./components/home/home"

import Login from './pages/login/login'
import { PrivateRoutes } from "./utils/PrivateRoutes"

import Users from "./pages/users/users"
import DashBoard from './pages/dashboard/dashboard'
import Calendario from './pages/calendario/calendario'
import Objetivos from './pages/objetivos/objetivos'
import Perfil from './pages/perfil/perfil'
import Absences from "./pages/absence/absence"
import Expenses from "./pages/expenses/expenses"
import Requests from "./pages/requests/requests"

import { useAuth } from "./contexts/authContext"


import './App.scss'
import { Register } from "./pages/register/register"


function App() {

  const { isAuthenticated } = useAuth()

  return (
    <>
        <Routes>
          <Route path="*" element={<Navigate to="/"/>}/>
          <Route path="/login" element={isAuthenticated ? <Navigate replace to={"/"}/> : <Login/>} />
          <Route path="/register" element={<Register/>}/>
          <Route element={<PrivateRoutes/>}>
            <Route path='/' element={<Home/>}>
              <Route path='/' element={<DashBoard/>}/>
              <Route path='/users' element={<Users/>}/>
              <Route path='/calendario' element={<Calendario/>}/>
              <Route path='/objetivos' element={<Objetivos/>}/>
              <Route path='/perfil' element={<Perfil/>}/>
              <Route path='/ausencias' element={<Absences/>}/>
              <Route path='/requests' element={<Requests/>}/>
              <Route path='/expenses' element={<Expenses/>}/>
            </Route>
          </Route>
        </Routes>
    </>
  )
}

export default App
