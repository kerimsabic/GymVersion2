import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from '@/scenes/NavBar'
import { SelectedPage } from '@/shared/types'

function App() {
 
  const [selectedPage,setSelectedPage]= useState<SelectedPage>(SelectedPage.Home)

  return <div className='app bg-gray-20'>
    <Navbar selectedPage={selectedPage} setSelectedPage={setSelectedPage}/>
  </div>
}

export default App
