import {  Routes, Route } from "react-router-dom"

import Home from "./components/home/home"

import Login from './pages/login/login'
import Users from "./pages/users/users"
import DashBoard from './pages/dashboard/dashboard'
import Calendario from './pages/calendario/calendario'
import Objetivos from './pages/objetivos/objetivos'
import Perfil from './pages/perfil/perfil'
import Absences from "./pages/absence/absence"
import Requests from "./pages/requests/requests"

import './App.scss'
import Expenses from "./pages/expenses/expenses"

function App() {

  return (
    <>
        <Routes>
          <Route path="/login" element={<Login/>}/>
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
        </Routes>
    </>
  )
}

export default App
