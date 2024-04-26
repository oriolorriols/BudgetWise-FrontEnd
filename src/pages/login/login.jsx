import React from 'react'

const Login = () => {
  return (
    <>
        <div className='flex justify-center items-center h-screen'>
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

             <div className='mb-5 text-center'>
                <button className='bg-sky-900 rounded-md p-2 m-2'>Login</button>
             </div>

            </div>
        </div>
    </>
  )
}

export default Login