import React from 'react'

import './login.scss'

const Login = () => {
  return (
    <>
        <div className='flex justify-center items-center h-screen'>
            <div className='mb-20'>

                <div className="flex justify-center mb-10">
                  <img className="justify-center" src="/public/cashwise3.png" width="200px" alt="" draggable="false"/>
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
                        <button className='bg-sky-900 rounded-lg p-3 m-2'>Login</button>
                    </div>

                </div>

            </div>
        </div>
    </>
  )
}

export default Login