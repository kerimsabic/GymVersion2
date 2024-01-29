import  { useEffect, useState } from 'react'
import Benefits from '../Benefits'
import Home from '../Home'
import OurClasses from '../ourClasses'
import { SelectedPage } from '@/shared/types'

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const HomePage = ({setSelectedPage}: Props) => {

  
    const [, setIsTopOfPage] = useState<boolean>(true);
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
    <>
    <Home setSelectedPage={setSelectedPage}/>
      
    <Benefits setSelectedPage={setSelectedPage}/>

    <OurClasses setSelectedPage={setSelectedPage}/>
    </>
  )
}

export default HomePage;