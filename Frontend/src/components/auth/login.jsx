import React from 'react'

function Login() {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='border-secondary border-2 py-10 px-5 shadow-[0px_15px_15px_rgba(0,0,0,0.4)]'>
        <h1 className='text-2xl text-primary font-extrabold mb-4 font-roboto'>Login</h1>
        <form className='flex flex-col space-y-5'>
          <input type='text' placeholder='Username' className='border-2 border-primary rounded-md p-2' />
          <input type='password' placeholder='Password' className='border-2 border-primary rounded-md p-2' />
          <button className='bg-primary text-white rounded-md p-2'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
