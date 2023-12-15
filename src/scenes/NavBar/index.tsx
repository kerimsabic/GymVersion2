import { useState } from "react"

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"
import Logo from "@/assets/Logo.png"
import Link from "./Link";
import { SelectedPage } from "@/shared/types";
import useMediaQuery from "@/hooks/useMediaQuery";

type Props = {
    selectedPage:SelectedPage;
    setSelectedPage: (value:SelectedPage)=>void;
}

const NavBar = ({selectedPage,setSelectedPage}: Props) => {

    const flexBetween = "flex items-center justify-between";
    const [isMenuToggled,setMenuToggled]=useState<boolean>(false);
    const isAboveMediaScreens= useMediaQuery("(min-width: 1060px)")

    return (
        <nav>
            <div className={`${flexBetween} fixed top-0 z-30 w-full py-6`}>
                <div className={`${flexBetween} mx-auto w-5/6`}>
                    <div className={`${flexBetween} w-full gap-16`}>

                        <img src={Logo} alt="logo" />
                        
{isAboveMediaScreens ? (<div className={`${flexBetween} w-full`}>
                            <div className={`${flexBetween} gap-16 text-sm`}>
                                <Link 
                                page="Home" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                <Link page="Benefits" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                <Link page="Our Classes" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                <Link page="Contact Us" selectedPage={selectedPage} setSelectedPage={setSelectedPage}/>
                            </div>
                            <div className={`${flexBetween} gap-8`}>
                                <p>sign In</p> 
                                <ActioButton setSelectedPage={selectedPage}>Become a Member</ActioButton>
                            </div>
                        </div>
                        ) : 
                        ( 
                            <button className="rounded-full bg-secondary-500 p-2"
                            onClick={()=>setMenuToggled(!isMenuToggled)}>
                                <Bars3Icon className="h-6 w-6 text-white"></Bars3Icon>
                            </button>
                        )}
                    </div>
        </div>
        </div >
    </nav >
  )
}

export default NavBar