import { useState } from 'react'
import { BrowserRouter,  Routes, Route } from "react-router-dom"
import Login from './pages/login/login-ant'
// import Login from './pages/login/login'
import Users from "./components/users/users"

import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path='/users' element={<Users/>}/>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
