import {  SelectedPage } from '@/shared/types';
import { motion } from 'framer-motion';

import BenefitsPageGraphic from "@/assets/BenefitsPageGraphic.png";
import HText from '@/shared/HText';

import ActionButton from '@/shared/ActionButton';
import { useGetPlansQuery } from '@/store/plansSlice';
import { useGetUserTokenQuery, useUpdateMembershipStripeMutation } from '@/store/memberSlice'; // Import the mutation hook
import { useSelector } from 'react-redux';
import { RootState } from '@/store';


export type MembershipFormForStripe = {
    userId?: string;
    trainingPlanId: string;
    numOfMonths: number;
    name: string | any;
    price: string | any;
}

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
};

const Plans = ({ setSelectedPage }: Props) => {
    const { data: plans } = useGetPlansQuery();
    const [updateMembershipStripe] = useUpdateMembershipStripeMutation();
    const { /*loading*/ userToken } = useSelector((state: RootState) => state.auth)
    const { data: member } = useGetUserTokenQuery(userToken!);
    const id = member?.id


    const handleChoosePlan = async (planId: string) => {
        // Retrieve necessary data from your state/context
        const userId = id; // Replace with actual user ID
        const selectedNumber = 1; // Adjust as necessary, could be dynamic
        const plan = plans?.find((p) => p.id === planId);

        if (plan) {
            const rawPrice = plan.price;
            const priceWithoutDollarSign = rawPrice.replace('$', '');

            const formDataWithUserType: MembershipFormForStripe = {
                userId,
                trainingPlanId: planId,
                numOfMonths: selectedNumber,
                price: priceWithoutDollarSign,
                name: plan.name
            };

            try {
                const paymentResponse = await updateMembershipStripe({ data: formDataWithUserType }).unwrap();
                if (paymentResponse && paymentResponse.paymentUrl) {
                    window.open(paymentResponse.paymentUrl, '_blank');
                } else {
                    console.error('Failed to get payment URL');
                    window.alert('Failed to get payment URL');
                }
            } catch (error) {
                console.error('Failed to create payment session', error);
                window.alert('Failed to create payment session');
            }
        } else {
            console.error('Selected plan not found');
            window.alert('Selected plan not found');
        }
    };

    return (
        <section id='plans' className='mx-auto min-h-full w-5/6 py-20'>
            <motion.div
                onViewportEnter={() => setSelectedPage(SelectedPage.Plans)}
            >
                {/* HEADER */}
                <div className='md:my-5 md:w-3/5'>
                    <HText children={"MORE THAN JUST A GYM!"}></HText>
                    <br />
                </div>
                <div className='w-full flex justify-center text-center p-5'>
                    <h1 className='font-montserrat basis-3/5 text-xl font-bold'>Training Plans we offer</h1>
                </div>

                {/* BENEFIT CARDS */}
                <div className='w-full justify-center align-center grid grid-cols-3 gap-4 max-sm:grid-cols-1 max-md:grid-cols-2'>
                    {plans && plans.map((plan) => (
                        <div key={plan.id} className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 hover:-translate-y-4 transition-transform duration-500 ease-in-out hover:border-yellow-400">
                            <h5 className="mb-4 text-2xl font-medium text-gray-500 dark:text-gray-400 uppercase text-center">{plan.name}</h5>
                            <div className="flex items-baseline text-gray-900 dark:text-white">
                                <span className="text-3xl font-semibold">$</span>
                                <span className="text-5xl font-extrabold tracking-tight">{plan.price.slice(0, -1)}</span>
                                <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
                            </div>
                            <ul role="list" className="space-y-5 my-7">
                                <p className="mb-5 text-base text-gray">{plan.description}</p>
                                <li className="flex items-center">
                                    <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                    </svg>
                                    <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">{plan.numOfPeople} team members</span>
                                </li>
                                <li className="flex">
                                    <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                    </svg>
                                    <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">{plan.accessTime} access time</span>
                                </li>
                                {plan.freeparking ? (
                                    <li className="flex">
                                        <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Free Parking</span>
                                    </li>
                                ) : (
                                    <li className="flex line-through decoration-gray-500">
                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 ms-3">Free Parking</span>
                                    </li>
                                )}
                                {plan.water ? (
                                    <li className="flex">
                                        <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Free Drink</span>
                                    </li>
                                ) : (
                                    <li className="flex line-through decoration-gray-500">
                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 ms-3">Free Drink</span>
                                    </li>
                                )}
                            </ul>
                            <button
                                type="button"
                                onClick={() => handleChoosePlan(plan.id)}
                                className="text-black bg-secondary-500 hover:bg-primary-500 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
                            >
                                Choose plan
                            </button>
                        </div>
                    ))}
                </div>

                {/* GRAPHICS AND DESCRIPTION */}
                <div className='mt-16 items-center justify-between gap-20 md:flex md-mt-28'>
                    {/* GRAPHIC */}
                    <img className='mx-auto' src={BenefitsPageGraphic} alt="Girl Image" />

                    {/* DESCRIPTION */}
                    <div>
                        {/* TITLE */}
                        <div className='relative'>
                            <div className='before:absolute before:-top-20 before:-left-20 before:z-[1] before:content-abstractwaves'></div>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5 }}
                                variants={{
                                    hidden: { opacity: 0, x: 50 },
                                    visible: { opacity: 1, x: 0 },
                                }}
                            >
                                <HText>MILLIONS OF HAPPY MEMBERS GETTING{" "}
                                    <span className='text-primary-500'>FIT</span>
                                </HText>
                            </motion.div>
                        </div>

                        {/* DESCRIPT */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            variants={{
                                hidden: { opacity: 0, x: -50 },
                                visible: { opacity: 1, x: 0 },
                            }}
                        >
                            <p className="my-5">Nascetur aenean massa auctor tincidunt. Iaculis potenti amet
                                egestas ultrices consectetur adipiscing ultricies enim. Pulvinar
                                fames vitae vitae quis. Quis amet vulputate tincidunt at in
                                nulla nec. Consequat sed facilisis dui sit egestas ultrices
                                tellus. Ullamcorper arcu id pretium sapien proin integer nisl.
                                Felis orci diam odio.</p>
                            <p className='mb-5'>Fringilla a sed at suspendisse ut enim volutpat. Rhoncus vel est
                                tellus quam porttitor. Mauris velit euismod elementum arcu neque
                                facilisi. Amet semper tortor facilisis metus nibh. Rhoncus sit
                                enim mattis odio in risus nunc.</p>
                        </motion.div>

                        {/* BUTTON */}
                        <div className="relative mt-16">
                            <div className="before:absolute before:-bottom-20 before:right-40 before:content-sparkles before:z-[-1]">
                                <ActionButton setSelectedPage={setSelectedPage}>
                                    Join Now
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Plans;
