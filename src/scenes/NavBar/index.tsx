import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Logo from "@/assets/Logo.png";
import Link from "./Link";
import { Link as Link2 } from 'react-router-dom';
import { SelectedPage } from "@/shared/types";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/authSlice";


type Props = {
  isTopOfPage: boolean;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }: Props) => {
  const flexBetween = "flex items-center justify-between";
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const navbarBackground = isTopOfPage ? "bg-primary-100" : "bg-primary-100 drop-shadow";



  const { userToken } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  return (
    <nav>
      <div
        className={`${navbarBackground} ${flexBetween} fixed top-0 z-30 w-full py-6`}
      >
        <div className={`${flexBetween} mx-auto w-5/6`}>
          <div className={`${flexBetween} w-full gap-16`}>
            {/* LEFT SIDE */}
            <Link2 to="/home"><img alt="logo" src={Logo} /></Link2>


            {/* RIGHT SIDE */}
            {isAboveMediumScreens ? (
              <div className={`${flexBetween} w-full`}>
                <div className={`${flexBetween} gap-8 text-sm`}>
                  <Link
                    page="Home"
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                  />
                  <Link
                    page="Plans"
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                  />
                  <Link
                    page="Our Classes"
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                  />
                  
                  {!userToken ?
                    (
                      <></>
                    )
                    :
                    (
                      
                      <Link2 to="/user">
        
                        <span className="active:text-red-400">Profile</span>
                      </Link2>
                    )}

                </div>

                <div className={`${flexBetween} gap-8`}>
                  {!userToken ?
                    (
                      <>
                        <Link2 to="/login">
                          <span className="border border-yellow-400 rounded-lg p-2 text-sm hover:border-red-500">Sign In</span>
                        </Link2>
                        <Link2 to="/register">
                          <span className="border border-yellow-400 rounded-lg p-2 text-sm hover:border-red-500">Register</span>
                        </Link2>  
                        </>
                    )
                    :
                    (
                      <Link2 to="/login">
                        <button onClick={() => { dispatch(logout()); }} className='text-red-500 flex justify-center items-center'><span className="border border-yellow-400 rounded-lg p-2 text-sm hover:border-red-500">Sign Out</span></button>
                      </Link2>
                    )}
                </div>

              </div>
            ) : (
              <button
                className="rounded-full bg-secondary-500 p-2"
                onClick={() => setIsMenuToggled(!isMenuToggled)}
              >
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU MODAL */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-primary-100 drop-shadow-xl">
          {/* CLOSE ICON */}
          <div className="flex justify-end p-12">
            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* MENU ITEMS */}
          <div className="ml-[33%] flex flex-col gap-10 text-2xl">
            <Link
              page="Home"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <Link
              page="Benefits"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <Link
              page="Our Classes"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <Link
              page="Contact Us"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            {!userToken ?
              (
                <></>
              )
              :
              (
                <Link2 to="/user">
                  <span>Profile</span>
                </Link2>
              )}
            {!userToken ?
              (
                <Link2 to="/login">
                  <span className="">Sign In</span>
                </Link2>)
              :
              (
                <Link2 to="/login">
                  <button onClick={() => { dispatch(logout()); }} className='text-red-500 flex justify-center items-center'><span className="">Sign Out</span></button>
                </Link2>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
