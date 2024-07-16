import {  Routes, Route, Navigate } from "react-router-dom"

import Home from "./components/home/home"

import Login from './pages/login/login'
import Confirm from "./pages/login/confirm"
import { PrivateRoutes } from "./utils/PrivateRoutes"

import Users from "./pages/users/users"
import DashBoard from './pages/dashboard/dashboard'
import Calendario from './pages/calendario/calendario'
import Objetivos from './pages/objetivos/objetivos'
import Profile from './pages/profile/profile'
import ObjetivosHR from './pages/objetivosHR/objetivosHR'
import Absences from "./pages/absence/absence"
import Expenses from "./pages/expenses/expenses"
import Requests from "./pages/requests/requests"
import CompanyProfile from "./pages/companyProfile/companyProfile"

import { useAuth } from "./contexts/authContext"

import './App.scss'
import { Register } from "./pages/register/register"


function App() {

  const { isAuthenticated, isHR } = useAuth()

  return (
    <>
        <Routes>
          <Route path="*" element={<Navigate to="/"/>}/>
          <Route path="/login" element={isAuthenticated ? <Navigate replace to={"/"}/> : <Login/>} />
          <Route path='/confirmregister/:userid' element={<Confirm/>}></Route>
          <Route path="/registro" element={<Register/>}/>
          <Route element={<PrivateRoutes/>}>
              <Route path='/' element={<Home/>}>
                  <Route path='/' element={<DashBoard/>}/>
                  <Route path="/usuarios" element={<Users />} />
                  <Route path='/calendario' element={<Calendario/>}/>
                  {isHR === 'HR' ? 
                      <Route path='/objetivos' element={<ObjetivosHR/>}/>
                      : <Route path='/objetivos' element={<Objetivos/>}/> 
                  }
                  <Route path='/perfil' element={<Profile/>}/>
                  <Route path='/viajes' element={<Absences/>}/>
                  <Route path='/solicitudes' element={<Requests/>}/>
                  <Route path='/gastos' element={<Expenses/>}/>
                  <Route path="/empresa" element={<CompanyProfile/>}/>        
              </Route>
          </Route>
        </Routes>
    </>
  )
}

export default App
