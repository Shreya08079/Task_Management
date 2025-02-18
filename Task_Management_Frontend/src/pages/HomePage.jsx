import React from 'react'
import Navbar from '../components/Navbar';


const HomePage = ({currUser,handleLogout}) => {
  return (
   <>
   <Navbar currUser={currUser} handleLogout={handleLogout}/>
   <h1>homepage</h1>
   </>
  )
}

export default HomePage