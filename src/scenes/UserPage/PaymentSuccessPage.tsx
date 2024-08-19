import { useUpdateMemberMembershipSpecialMutation } from '@/store/memberSlice';
import  { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [updateMembershipPlan] = useUpdateMemberMembershipSpecialMutation();
    const [successMessage, setSuccessMessage] = useState('Processing Payment...');
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        // Extract query parameters
        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get('user_id');
        const trainingPlanId = queryParams.get('training_plan_id');
        const numOfMonths = queryParams.get('num_of_months');

        if (userId && trainingPlanId && numOfMonths) {
            // Prepare data for the mutation
            const data = {
                trainingPlanId,
                numOfMonths,
            };

            // Trigger the mutation to update membership
            updateMembershipPlan({ id: userId, data })
                .unwrap()
                .then((response) => {
                    console.log('Membership updated successfully', response);
                    setSuccessMessage('Payment successful! Redirecting to Profile Page...');
                    // Delay before redirecting
                    setTimeout(() => {
                        setIsProcessing(false);
                        navigate('/user'); // Redirect to home page after successful update
                        window.location.reload();
                    }, 3000); // 3 seconds delay
                })
                .catch((error) => {
                    console.error('Failed to update membership', error);
                    setSuccessMessage('Failed to update membership. Please try again.');
                    setIsProcessing(false);
                });
        } else {
            console.error('Missing required query parameters');
            setSuccessMessage('Payment details are missing.');
            setIsProcessing(false);
        }
    }, [location.search, updateMembershipPlan, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
                <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-20 h-20 mx-auto text-green-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                </div>
                <h1 className="text-xl font-semibold mb-4">{successMessage}</h1>
                {isProcessing && <p className="text-gray-600">Please wait while we finalize your payment.</p>}
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
