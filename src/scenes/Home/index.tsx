import { SelectedPage } from '@/shared/types'
import useMediaQuery from '@/hooks/useMediaQuery'
import ActionButton from '@/shared/ActionButton'
import HomePageText from "@/assets/HomePageText.png";
import HomePageGraphic from "@/assets/HomePageGraphic.png";
import SponsorRedBull from "@/assets/SponsorRedBull.png";
import SponsorForbes from "@/assets/SponsorForbes.png";
import SponsorFortune from "@/assets/SponsorFortune.png";
import React from 'react'
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { motion } from 'framer-motion';

type Props = {
    setSelectedPage: (value: SelectedPage) => void;

}

const Home = ({ setSelectedPage }: Props) => {
    const isAboveMediumScreens = useMediaQuery("(min-width:1060px)")
    return (
        <section
            id='home'
            className='bg-gray-20 gap-16 py-10 md:h-full md:pb-0'>

            <div className='md:flex mx-auto w-5/6 items-center justify-center md:h-5/6'>
                <div className='z-10 mt-32 md:basis-3/5'>
                    <div 
                    >
                        <motion.div className='relative'
                        initial="hidden" 
                        whileInView="visible"
                        viewport={{once:true, amount:0.5}}
                        transition={{duration:1}}
                        variants={{
                            hidden: { opacity: 0, x: -60 },
                            visible: { opacity: 1, x: 0 },
                          }}>
                            <div className='before:absolute before:-top-20 md:before:content-evolvetext before:-left-20 before:z-[-1]'>
                                <img src={HomePageText} alt="home-page-text" />
                            </div>
                        </motion.div>
                        <p className='mt-6'>
                            Unrivaled Gym. Unparalleled Training Fitness Classes. World Class
                            Studios to get the Body Shapes That you Dream of.. Get Your Dream
                            Body Now.
                        </p>
                    </div>

                    <motion.div 
                        className='flex gap-16 items-center mt-8'
                        initial="hidden" 
                        whileInView="visible"
                        viewport={{once:true, amount:0.5}}
                        transition={{delay:0.2, duration:1}}
                        variants={{
                            hidden: { opacity: 0, x: -60 },
                            visible: { opacity: 1, x: 0 },
                        }}>
                        <ActionButton setSelectedPage={setSelectedPage}
                        >
                            Join Now
                        </ActionButton>
                        <AnchorLink
                            className="text-sm font-bold text-primary-500 underline hover:text-secondary-500"
                            onClick={() => setSelectedPage(SelectedPage.ContactUs)}
                            href={`#${SelectedPage.ContactUs}`}
                        >
                            <p>Learn More</p>
                        </AnchorLink>
                    </motion.div>
                </div>
                <div className='flex basis-3/5 justify-center md:z-10 md:ml-40 md:mt-16 md:justify-items-end'>
                    <img src={HomePageGraphic} alt="home-page-graphic" />
                </div>
            </div>
            {isAboveMediumScreens && (
                <div className='h-[150px] w-full bg-primary-100 py-10'>
                    <div className='mx-auto my-auto w-5/6'>
                        <div className='flex gap-12 place-content-evenly '>
                            <img src={SponsorRedBull} alt="redbul-sponsor" />
                            <img src={SponsorRedBull} alt="redbul-sponsor" />
                            <img src={SponsorRedBull} alt="redbul-sponsor" />
                            <img src={SponsorRedBull} alt="redbul-sponsor" />
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Home