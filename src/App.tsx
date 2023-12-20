import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from '@/scenes/NavBar'
import Home from '@/scenes/Home'
import { SelectedPage } from '@/shared/types'
import Benefits from './scenes/Benefits'
import OurClasses from './scenes/ourClasses'
import Footer from './scenes/Footer'


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

    <div className='app bg-gray-20'>

      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage} />
        
      <Home setSelectedPage={setSelectedPage}/>
      
      <Benefits setSelectedPage={setSelectedPage}/>

      <OurClasses setSelectedPage={setSelectedPage}/>

      <Footer />


    </div>
  )
}

export default App
