// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import dotenv from dotenv


// console.log(process.env.SERVER_DOMAIN)
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Search from './pages/Search'
import Settings from './pages/Settings'
import React from 'react'
import Sidebar from './components/Sidebar'
import Notifications from './components/Notifications'
function App() {

  return (
    
    <BrowserRouter>
      <Sidebar></Sidebar>
      <Routes>
        

        <Route path = "/signup" Component={SignUp}></Route>
        <Route path = "/login" Component={Login}></Route>
        <Route path = "/profile/:id" Component={Profile}></Route>
        <Route path = "/" Component={Dashboard}></Route>
        <Route path = "/search" Component = {Search}></Route>
        <Route path = "/settings" Component={Settings}></Route>
        
      </Routes>
      <Notifications></Notifications>
    </BrowserRouter>
    
  )
}

export default App
