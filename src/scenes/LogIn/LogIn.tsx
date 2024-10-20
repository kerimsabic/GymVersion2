import { useForm } from "react-hook-form"
import { Alert } from "@material-tailwind/react";
import Logo from "@/assets/Logo.png";
import { AppDispatch, RootState } from "@/store"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/store/authSlice";
import { useEffect } from "react";



export type LogInFormData = {
    email: string;
    password: string;
}

/*const schema = yup.object({
    email: yup.string().email().required('Email is required'),
    password: yup.string().required('Password is required').min(6),
})*/

const LogIn = () => {

    const { register, handleSubmit } = useForm<LogInFormData>({
       // resolver: yupResolver(schema)
    });
    const navigate = useNavigate()
    const { /*loading*/ userToken, error } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (userToken) {
          //  console.log(userToken)
            navigate('/home')
        }
    }, [navigate, userToken])

    const onSubmit = (data: LogInFormData) => {
        dispatch(login(data))
    }





    return (
        <section className="bg-[#e1dfdf">
            {
                error &&
                <Alert className="h-12 mt-20" color="red"><p>{error}</p></Alert>
            }
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
                   
                   <img src={Logo} alt="" />
                </a>
                <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl flex justify-center">
                            Sign in to your account
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                                <input type="text" id="email2" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  {...register("email")} />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                                <input type="password" id="password2" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("password")} />
                            </div>
                            
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LogIn

