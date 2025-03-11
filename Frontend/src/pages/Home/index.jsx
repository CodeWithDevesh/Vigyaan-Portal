import React from 'react'
import Signup from '../../components/auth/signup'

function Home() {
  return (
    <div className='min-h-screen w-screen flex justify-center items-center'>
      <h1 className='text-primary font-bold text-2xl'>Home</h1>
       <Signup/>
    </div>
  )
}

export default Home
