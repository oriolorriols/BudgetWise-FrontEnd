import React from 'react'
import { Link } from "react-router-dom";

import './login.scss'

const Login = () => {
  return (
    <>
        <div className='flex justify-center items-center h-screen'>
            <div className='mb-20'>

                <div className="flex justify-center mb-7">
                  <img className="justify-center" src="/CashTrack.png" width="250px" alt="" draggable="false"/>
                </div>
            
                <div className='card'>
                    <div className='mb-5'>
                        <label className="block" htmlFor="username">Username</label>
                        <input className="p-2 mt-1" type="text" placeholder='Enter Username'/>
                    </div>
                    
                    <div className='mb-5'>
                        <label className="block" htmlFor="password">Password</label>
                        <input className="p-2 mt-1" type="password" placeholder='Enter Password'/>
                    </div>
                
                    <input className="mr-2" type="checkbox" />
                    <label htmlFor="remember">Remember me</label>

                    <div className='mt-8 text-center'>
                        <Link  to="/users" className='bg-sky-900 rounded-lg p-3 m-2'>Login
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    </>
  )
}

export default Login