import { RootState } from '@/store'
import { useGetMemberAttendanceQuery, useGetMemberIdQuery, useGetMemberMembershipQuery, useGetTrainingPlanQuery, useGetUserTokenQuery, useRenewMembershipMutation, useUpdateMemberMembershipSpecialMutation, useUpdateMemberPasswordMutation, useUpdateMembershipStripeMutation } from '@/store/memberSlice'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import { useSelector } from 'react-redux'
import { yupResolver } from "@hookform/resolvers/yup"
import { useGetPlansQuery } from '@/store/plansSlice'
import Spinner from '../Spinner/Spinner'

export type PasswordForm = {
    password: string,
    repeatedPassword: string
}

export type MembershipForm = {
    userId?: string;
    trainingPlanId: string;
    numOfMonths: number;
}

export type MembershipFormForStripe = {
    userId?: string;
    trainingPlanId: string;
    numOfMonths: number;
    name: string | any;
    price: string | any;
}

const schema = yup.object().shape({
    password: yup.string().required('New Password is required'),
    repeatedPassword: yup.string().required('Confirm Password is required').oneOf([yup.ref('password')], 'Passwords must match')
});

const UserPage = () => {

    const { /*loading*/ userToken } = useSelector((state: RootState) => state.auth)

    const { data: member, isSuccess } = useGetUserTokenQuery(userToken!);
    const id = member?.id

    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const [selectedNumber, setSelectedNumber] = useState<number>(1);
    const [isPlanSelected, setIsPlanSelected] = useState(false);

    const [isLoadingData, setIsLoadingData] = useState(false);



    const { data: plans } = useGetPlansQuery();
    

    const { data: memberMembership, refetch: refetchMembers } = useGetMemberIdQuery(id!);
    const { data: memberAttendance,  } = useGetMemberAttendanceQuery(id!);
    const { data: membership,  } = useGetMemberMembershipQuery(id!);
    const trainingPlanId = membership?.trainingPlanId;
    const { data: plan } = useGetTrainingPlanQuery(trainingPlanId!);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [showUpdatePlanForm, setShowUpdatePlanForm] = useState(false);

    const [renewMembership] = useRenewMembershipMutation();
    const [] = useUpdateMemberMembershipSpecialMutation();
    const [updateMembershipPlanStipe] = useUpdateMembershipStripeMutation();

    useEffect(() => {
        if (isSuccess && id) {
            refetchMembers; 
        }
    }, [isSuccess, id]);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState<PasswordForm | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<PasswordForm>({
        resolver: yupResolver(schema),
    });

    const { handleSubmit: handleSubmit2 } = useForm<MembershipForm>();
    const [updatePassword] = useUpdateMemberPasswordMutation();

    const handleFormSubmittion: SubmitHandler<PasswordForm> = (data) => {
        setFormData(data);
        setIsModalVisible(true); // Show the modal when submit is clicked
    };

    const handleConfirm = async () => {
        if (!formData) return;

        setIsLoadingData(true); // Show the spinner

        try {
            // Replace this with your actual API call
            const response = await updatePassword({ id: id, data: formData });

            if (response) {
                window.alert("Successfully updated password");
                setIsFormVisible(false);
            } else {
                window.alert("Failed to update password");
            }
        } catch (error: any) {
            console.error("Error updating password:", error);

            if (error.response) {
                window.alert("Failed to update password: " + error.response.data.message);
            } else {
                window.alert("Failed to update password: " + error.message);
            }
        } finally {
            setIsLoadingData(false); // Hide the spinner
            setIsModalVisible(false); // Hide the modal
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Just hide the modal
    };
    const handleRenewMembershipClick = () => {
        setShowConfirmation(false);
        
        renewMembership({ id: id })
            .unwrap()
            .then((data) => {
                // Check if the response contains an error
                if (data.error) {
                    // Handle error response
                    console.error('Failed to renew membership', data.error);
                    window.confirm('Failed to renew membership');
                } else {
                    // Handle success response
                    console.log('Membership renewed successfully', data);
                    window.confirm('Membership renewed successfully');
                }
            })
            .catch((error) => {
                // Handle other errors
                console.error('Failed to renew membership', error);
                window.confirm('Failed to renew membership');
            });
    };



    const formatDateString = (dateString: string | undefined) => {
        const date = new Date(dateString!);
        return date.toLocaleString();
    };


    const { data: trainingPlan, } = useGetTrainingPlanQuery(selectedPlanId, {
        skip: !selectedPlanId, // Skip query if no plan is selected
    });

    const handleupdateMembershipPlanClick: SubmitHandler<MembershipForm> = async () => {
       // const { data: plan, error: fetchError } = useGetTrainingPlanQuery(selectedPlanId);

       

        const rawPrice = trainingPlan?.price;
        const priceWithoutDollarSign = rawPrice?.replace('$', '');

        const formDataWithUserType: MembershipFormForStripe = {
            userId: id,
            trainingPlanId: selectedPlanId,
            numOfMonths: selectedNumber,
            price: priceWithoutDollarSign,
            name : trainingPlan?.name
        };
        setShowUpdatePlanForm(false);
        try {
            // Call mutation to create payment session
            const paymentResponse = await updateMembershipPlanStipe({ data: formDataWithUserType }).unwrap();

            if (paymentResponse && paymentResponse.paymentUrl) {
                // Redirect to the Stripe payment URL
                window.open(paymentResponse.paymentUrl, '_blank');
            } else {
                console.error('Failed to get payment URL');
                window.alert('Failed to get payment URL');
            }
        } catch (error) {
            console.error('Failed to create payment session', error);
            window.alert('Failed to create payment session');
        }
    };

    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedPlanId(selectedValue);
        setIsPlanSelected(!!selectedValue); // Update isPlanSelected based on whether a value is selected
    };



    return (
        <>

            {showConfirmation && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-md">
                        <p className="text-xl font-semibold mb-4">
                            Are you sure you want to renew existing membership?
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="mr-4 text-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRenewMembershipClick()}
                                className={`bg-yellow-400 hover:bg-yellow-600 text-black font-bold py-2 px-4 border border-yellow-700 rounded `}

                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showUpdatePlanForm && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-md">

                        <div className='flex'>
                            <p className="text-xl font-semibold mb-4">
                                Are you sure you want to renew existing membership?
                            </p>

                        </div>

                        <div className=' w-full pb-48 justify-center items-center'>
                            <form className='' onSubmit={handleSubmit2(handleupdateMembershipPlanClick)}>
                                {/* Training Plan Dropdown */}
                                <div className="relative mb-5 group pt-5">

                                    <select
                                        onChange={handlePlanChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option value="" disabled selected>
                                            Select a Training Plan
                                        </option>
                                        {plans?.map((plan) => (
                                            <option
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                key={plan.id}
                                                value={plan.id}
                                            >
                                                {plan.name} - {plan.price}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                {/* Number of Months Dropdown */}

                                <div className="relative mb-5 group pt-5">
                                    <p className='absolute top-0'>Months</p>
                                    <select
                                        onChange={(e) => {
                                            const selectedValue = parseInt(e.target.value, 10);
                                            console.log(selectedValue);
                                            setSelectedNumber(selectedValue);
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        {[...Array(12).keys()].map((number) => (
                                            <option
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                key={number + 1}
                                                value={number + 1}
                                            >
                                                {number + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center items-center ">
                                    <input
                                        type="submit"
                                        className={`h-[40px] cursor-pointer text-white bg-yellow-500 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${!isPlanSelected && 'opacity-50 cursor-not-allowed'}`} // Disable button if no plan is selected
                                        disabled={!isPlanSelected} // Disable button if no plan is selected
                                    />
                                </div>
                            </form>

                        </div>
                        <button
                            onClick={() => { setShowUpdatePlanForm(false), setIsPlanSelected(false) }}
                            className=" text-yellow-500 text-end w-full fond-bold text-xl "
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}

            <div className=''>
                <div className="flex items-center justify-center h-[50%] ">
                    <div className="p-5 border rounded text-center text-gray-500 max-w-sm bg-white mt-24 mb-5">
                        <img
                            className="w-32 h-32 rounded-full mx-auto bg-black"
                        />
                        <div>
                            <button><p>Edit Photo</p></button>
                        </div>
                        <div className="text-xl mt-5">
                            <a
                                href="#"
                                className="font-medium leading-none text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out"
                            >
                                {member?.firstName + " " + member?.lastName}
                            </a>
                            <p>{member?.userType}</p>
                        </div>
                        <p className="mt-2 text-sm text-gray-900">
                            Email:
                        </p>
                        <p className="mt-2 text-sm text-gray-900">
                            {member?.email}
                        </p>
                        <p className="mt-2 text-sm text-gray-900">
                            Username:
                        </p>
                        <p className="mt-2 text-sm text-gray-900">
                            {member?.username}

                        </p>
                    </div>
                </div>


                <div className="bg-white overflow-hidden shadow rounded-lg border sm:mx-36 ">
                    <div className="px-4 py-5 sm:px-6 bg-primary-100">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex justify-center">
                            User Profile
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 ">Full name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
                                    {member?.firstName + " " + member?.lastName}
                                </dd>
                            </div>

                        </dl>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {member?.email}
                                </dd>
                            </div>

                        </dl>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Username</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {member?.username}
                                </dd>
                            </div>

                        </dl>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Address</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {member?.address}
                                </dd>
                            </div>

                        </dl>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {member?.phone}
                                </dd>
                            </div>

                        </dl>
                    </div>

                    {member?.userType === "MEMBER" ? (
                        <>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Trainer</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {memberMembership?.trainerName}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Training Plan</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {memberMembership?.trainingPlanName}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                        </>
                    ) : null}

                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">

                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <button onClick={() => { setIsFormVisible(true) }} className='rounded-md bg-secondary-500 px-10 py-2 hover:bg-primary-500 hover:text-white'>Change Password</button>
                                </dd>
                            </div>
                        </dl>
                        {isFormVisible && (
                            <div className='pr-5 pl-5'>
                                <h2>Change Password</h2>

                                <form onSubmit={handleSubmit(handleFormSubmittion)}>

                                    <div className="border border-gray-300 rounded-md mb-3">
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            className="w-full p-2"
                                            {...register("password")}
                                        />
                                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                                    </div>

                                    <div className="border border-gray-300 rounded-md mb-3">
                                        <input
                                            type="password"
                                            placeholder="Repeat Password"
                                            className="w-full p-2"
                                            {...register("repeatedPassword")}
                                        />
                                        {errors.repeatedPassword && <p className="text-red-500">{errors.repeatedPassword.message}</p>}
                                    </div>
                                    <div className='flex justify-between'>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={() => setIsFormVisible(false)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                        >
                                            Cancle
                                        </button>
                                    </div>

                                </form>
                            </div>
                        )}

                        {isModalVisible && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                <div className="bg-white p-4 rounded-md shadow-md">
                                    <p>Are you sure you want to update your password?</p>
                                    <div className="mt-4 flex flex-col items-center">
                                        {isLoadingData ? (
                                           
                                                 <Spinner /> 
                                           
                                           
                                        ) : (
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleConfirm}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <h1 className='mx-10 text-center mt-10'>Membership & Plan Information:</h1>
                        <div className='flex justify-center mt-5 gap-5 max-md:flex-col md:flex-row items-center'>
                            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700  hover:border-yellow-400 min-h-[485px] flex flex-col justify-between">
                                <h5 className="mb-4 text-2xl font-medium text-gray-500 dark:text-gray-400 uppercase text-center">MEMBERSHIP</h5>
                                <ul role="list" className="space-y-5 my-7">
                                    <li className="flex items-center">
                                        <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Start Date: <span className='font-bold text-md'>{formatDateString(membership?.startDate)}</span></span>
                                    </li>
                                    <li className="flex">
                                        <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">End Date: <span className='font-bold text-md'>{formatDateString(membership?.endDate)}</span></span>
                                    </li>
                                    <li className="flex">
                                        <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Current Plan: <span className='font-bold text-md'>{membership?.trainingPlanName}</span></span>
                                    </li>
                                    <li className="flex">
                                        <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Current Plan Price: <span className='font-bold text-md'>{membership?.trainingPlanPrice}</span></span>
                                    </li>
                                </ul>
                                <button onClick={() => setShowConfirmation(true)} type="button" className="text-black  bg-secondary-500  hover:bg-primary-500 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Renew membership</button>
                            </div>

                            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700  ease-in-out hover:border-yellow-400">
                                <h5 className="mb-4 text-2xl font-medium text-gray-500 dark:text-gray-400 uppercase text-center">TRAINING PLAN</h5>
                                <div className="flex items-baseline text-gray-900 dark:text-white">
                                    <span className="text-3xl font-semibold">$</span>
                                    <span className="text-5xl font-extrabold tracking-tight">{plan?.price.slice(0, -1)}</span>
                                    <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
                                </div>
                                <h5 className="mt-4 text-xl font-medium text-gray-500 dark:text-gray-400 uppercase text-center">{plan?.name}</h5>
                                <ul role="list" className="space-y-5 my-7">
                                    <p className="mb-5 text-base text-gray">{plan?.description}</p>
                                    <li className="flex items-center">
                                        <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">{plan?.numOfPeople} team members</span>
                                    </li>
                                    <li className="flex">
                                        <svg className="flex-shrink-0 w-4 h-4 text-yellow-400 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">{plan?.accessTime} access time</span>
                                    </li>
                                    {plan?.freeparking ? (
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
                                    {plan?.water ? (
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
                                <button onClick={() => setShowUpdatePlanForm(true)} type="button" className="text-black  bg-secondary-500  hover:bg-primary-500 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Choose different plan</button>
                            </div>
                        </div>



                        <h1 className='mx-10 text-center mt-10'>Attendace Information:</h1>
                        <h1 className='mx-10  mt-10 text-gray-500'>Total Attendance In Last 30 days:
                            <span className='text-yellow-400 text-3xl font-bold'>
                                {" " + memberAttendance?.length}
                            </span></h1>
                        <div className='pt-10 grid grid-cols-4 gap-2 max-xs:grid-cols-2 mx-2 mb-5'>
                            {memberAttendance && memberAttendance.map((attandance: any) => (

                                <div className="block max-w-xs p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                    <div className='flex justify-between'>
                                        <h5 className="mb-2 text-sm  tracking-tight text-gray-900 dark:text-white">Attendance Date</h5>
                                        <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20.2739 9.86883L16.8325 4.95392L18.4708 3.80676L21.9122 8.72167L20.2739 9.86883Z" fill="currentColor"></path><path d="M18.3901 12.4086L16.6694 9.95121L8.47783 15.687L10.1985 18.1444L8.56023 19.2916L3.97162 12.7383L5.60992 11.5912L7.33068 14.0487L15.5222 8.31291L13.8015 5.8554L15.4398 4.70825L20.0284 11.2615L18.3901 12.4086Z" fill="currentColor"></path><path d="M20.7651 7.08331L22.4034 5.93616L21.2562 4.29785L19.6179 5.445L20.7651 7.08331Z" fill="currentColor"></path><path d="M7.16753 19.046L3.72607 14.131L2.08777 15.2782L5.52923 20.1931L7.16753 19.046Z" fill="currentColor"></path><path d="M4.38208 18.5549L2.74377 19.702L1.59662 18.0637L3.23492 16.9166L4.38208 18.5549Z" fill="currentColor"></path></svg>
                                    </div>

                                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400"><span className='font-bold'>{formatDateString(attandance.date)}</span> </p>
                                </div>
                            ))}
                        </div>
                       

                    </div>

                </div>

            </div>



        </>
    )
}

export default UserPage;
