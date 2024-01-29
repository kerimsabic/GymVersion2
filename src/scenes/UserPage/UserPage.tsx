import { RootState } from '@/store'
import { useGetMemberIdQuery, useGetUserTokenQuery, useUpdateMemberPasswordMutation } from '@/store/memberSlice'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import { useSelector } from 'react-redux'
import { yupResolver } from "@hookform/resolvers/yup"



export type PasswordForm = {

    password: string,
    //confirmpassword: string

}

const schema = yup.object().shape({
    password: yup.string().required('New Password is required'),
   /* confirmpassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm Password is required'),*/
});

const UserPage = () => {

    const { /*loading*/ userToken } = useSelector((state: RootState) => state.auth)

    const { data: member, isSuccess } = useGetUserTokenQuery(userToken!);
    const id = member?.id
    const { data: memberMembership, refetch:refetchMembers } = useGetMemberIdQuery(id!)

    const [updatePassword]= useUpdateMemberPasswordMutation();

    useEffect(() => {
        if (isSuccess && id) {
          refetchMembers;
        }
      }, [isSuccess, id]);
    

    const [isFormVisible, setIsFormVisible] = useState(false);

     const { register, handleSubmit, } = useForm<PasswordForm>({
         resolver: yupResolver(schema),
     });

     const handleFormSubmittion: SubmitHandler<PasswordForm> = async (data) => {
    
        try {
            console.log(data)
            await updatePassword({id:id, data:data})

            if(isSuccess){
                window.confirm("Successfully updated password"),
                setIsFormVisible(!isFormVisible)
            }
          }
                 
         catch (error) {
          console.error("Error updating plan:", error);
        }
      };
    

    return (
        <>

            <div className=''>
                <div className="flex items-center justify-center h-[50%] ">
                    <div className="p-5 border rounded text-center text-gray-500 max-w-sm bg-white mt-24 mb-5">
                        <img
                            className="w-32 h-32 rounded-full mx-auto bg-black"
                           
                        />
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
                                <dt className="text-sm font-medium text-gray-500">Password</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <button onClick={() => { setIsFormVisible(true) }}>Change Password</button>
                                </dd>
                            </div>
                        </dl>
                        {isFormVisible && (
                            <div>
                                <h2>Change Password</h2>
                               
                                <form onSubmit={handleSubmit(handleFormSubmittion)}>
                                   
                                    <div className="border border-gray-300 rounded-md mb-3">
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            className="w-full p-2"
                                            {...register("password")}
                                        />
                                    </div>
                         {/* <div className="border border-gray-300 rounded-md mb-3">
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="w-full p-2"
                                            {...register("password")}
                                        />
                                    </div>*/}
                                  
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>

                </div>

            </div>



        </>
    )
}

export default UserPage