import { useState } from 'react';
import Logo from "@/assets/Logo.png";
import { useAddMemberMutation, useGetTrainingPlanQuery,  useUpdateMembershipStripeRegisterMutation } from '@/store/memberSlice';
import { useGetPlansQuery } from '@/store/plansSlice';
import { MembershipFormForStripe } from '../Benefits';
import { BASE_URL } from '@/shared/data';

const Register = () => {
  const { data: plans, isSuccess } = useGetPlansQuery();
  const [addMember] = useAddMemberMutation();
  const [updateMembershipStripe] = useUpdateMembershipStripeRegisterMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    trainingPlanId: '', // Add trainingPlanId field
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    trainingPlanId: '',
  });

  const validate = () => {
    let newErrors = { ...errors };

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else {
      newErrors.firstName = '';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else {
      newErrors.username = '';
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else {
      newErrors.lastName = '';
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else {
      newErrors.address = '';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      newErrors.email = '';
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else {
      newErrors.password = '';
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    } else {
      newErrors.confirmPassword = '';
    }

    // Validate phone
    const phoneRegex = /^[0-9]{9}$/; // Assuming 10 digits phone number
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    } else {
      newErrors.phone = '';
    }

    // Validate training plan selection
    if (!formData.trainingPlanId) {
      newErrors.trainingPlanId = 'Please select a training plan';
    } else {
      newErrors.trainingPlanId = '';
    }

    setErrors(newErrors);
    
    // Return true if no errors
    return Object.values(newErrors).every(error => !error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [submitError, setSubmitError] = useState('');

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Perform validation
  if (!validate()) {
    return; // Do not submit if validation fails
  }

  const { trainingPlanId, ...restFormData } = formData;
  const dataToSend = { ...restFormData, trainingPlanId: trainingPlanId, numOfMonths: 1 };

  try {
    const response = await addMember(dataToSend).unwrap();
    console.log('Member added successfully:', response);
    
    // Reset the form and clear errors after successful submission
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      address: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      trainingPlanId: '',
    });
    setErrors({ ...errors }); // Reset errors
    setSubmitError(''); // Clear any submit errors

    handleGetPlan(response.id, trainingPlanId);
  
  } catch (error) {
    setSubmitError('Member already exists');
    console.error('Error adding member:', error);
  }
};

const handleGetPlan = async (id: any, trainingPlanId: any) => {
  try {
    // Replace with your API call to get training plan details
    const response = await fetch(`${BASE_URL}/trainingPlans/${trainingPlanId}`);
    const planData = await response.json();
    
    if (!response.ok) {
      throw new Error('Failed to fetch training plan details');
    }

    const rawPrice: any = planData.price;
    const priceWithoutDollarSign = rawPrice.replace('$', '');
    const name = planData.name;
    
    console.log("Training Plan:", planData);
    handleStripe(id, trainingPlanId, rawPrice, name);  
  } catch (error) {
    console.error('Error fetching training plan:', error);
    window.alert('An error occurred while fetching the training plan');
  }
};

const handleStripe = async (id : any, trainingPlanId : any, rawPrice:any, name:any) => {
  try {
  
   
    const selectedNumber = 1;
    const priceWithoutDollarSign = rawPrice.replace('$', '');
    // Assuming `updateMembershipStripe` needs to be called with the form data
   // const { trainingPlanId } = formData;
    const formDataWithUserType: MembershipFormForStripe = {
      userId: id, // This assumes you have `response.id` available
      trainingPlanId: trainingPlanId,
      numOfMonths: selectedNumber,
      price: priceWithoutDollarSign, // Ensure this is properly set in your state
      name: name, // Ensure this is properly set in your state
    };
    console.log("formza za tripe: " + formDataWithUserType)
    const paymentResponse = await updateMembershipStripe({ data: formDataWithUserType }).unwrap();
    
    if (paymentResponse && paymentResponse.paymentUrl) {
      // Redirect to Stripe payment page
      window.location.href = paymentResponse.paymentUrl;

      // Optional: Handle redirection after payment
      // You can use Stripe's success URL to automatically redirect to the login page
      // if this is supported by your implementation
      // or set up a webhook to listen for successful payments and handle redirection on your server
    } else {
      console.error('Failed to get payment URL');
      window.alert('Failed to get payment URL');
    }
  } catch (error) {
    console.error('Error handling Stripe payment:', error);
    window.alert('An error occurred while processing the payment');
  }
};

  return (
    <section className="pt-[100px] pb-[100px] bg-gray-20">
     
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img src={Logo} alt="logo" />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            {submitError && <div className="text-lg text-red-500">{submitError}</div>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                  <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                  <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input type="text" name="username" id="username" value={formData.username} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123 Main St" />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123 Main St" />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1234567890" />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Training Plan</label>
                <select name="trainingPlanId" id="trainingPlanId" value={formData.trainingPlanId} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Select a plan</option>
                  {isSuccess && plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                {errors.trainingPlanId && <p className="text-red-500 text-sm">{errors.trainingPlanId}</p>}
              </div>
               {/* Submit button */}
               <button type="submit" className="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
