import { useEffect, useState } from 'react'
import './App.css'
import Navbar from '@/scenes/NavBar'
import { SelectedPage } from '@/shared/types'
import Footer from './scenes/Footer'
import { Route, Routes } from "react-router-dom"
import HomePage from './scenes/HomePage/HomePage'
import LogIn from './scenes/LogIn'
import UserPage from './scenes/UserPage/UserPage'
import Register from './scenes/Register'
import PaymentSuccessPage from './scenes/UserPage/PaymentSuccessPage'


function App() {

  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home);
      }
      else {
        setIsTopOfPage(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }
  )

  return (

    <div className='app '>

      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage} />
      <Routes>
        <Route path="/" element={<HomePage setSelectedPage={setSelectedPage} />} />
        <Route path="/home" element={<HomePage setSelectedPage={setSelectedPage} />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/user' element={<UserPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path='/register' element={<Register />} />

      </Routes>
      <Footer />


    </div>
  )
}

export default App
