 // Assuming the correct path for the API slice
import { useGetUserTokenQuery, useSetTrainerMutation } from "@/store/memberSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Props = {
  name: string;
  email?: string;
  image: string;
  trainerId: string;
};


const Class = ({ name, email, image, trainerId }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle submission
    const userToken = useSelector((state: any) => state.auth.userToken); 
    const { data: member, isSuccess } = useGetUserTokenQuery(userToken!);
    const id = member?.id


  const [setTrainer] = useSetTrainerMutation();

  const navigate = useNavigate();

  const handleChooseTrainer = () => {
    if (!userToken) {
      // Redirect the user to login if they are not authenticated
      navigate("/home");
      return;
    }
    setIsModalOpen(true); // Open the modal
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Send the request to assign the trainer to the member
      await setTrainer({ memberId: id, trainerId }).unwrap();
      alert("Trainer successfully assigned!");
    } catch (error) {
      console.error("Failed to assign trainer:", error);
      alert("Error assigning trainer. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false); // Close the modal
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal
  };

  const overlayStyles = `p-5 absolute z-30 flex
    h-[247px] w-[450px] flex-col items-center justify-center
    whitespace-normal bg-primary-500 text-center text-white
    opacity-0 transition duration-500 hover:opacity-90 rounded-2xl`;

    return (
        <li className="relative mx-5 inline-block h-[380px] w-[450px]">
          <div className="flex justify-center items-center h-[50px]">
            <h1 className="text-xl">{name}</h1>
          </div>
    
          <div className={overlayStyles}>
            <p className="text-2xl">{name}</p>
            <p className="mt-5">{email}</p>
          </div>
    
          <img
            alt={`${name}`}
            src={image}
            className="rounded-2xl h-[65%] m-auto"
          />
    
          <div className="flex justify-center items-center h-[50px]">
            <button
              onClick={handleChooseTrainer}
              type="button"
              className="text-black bg-secondary-500 hover:bg-primary-500 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center text-center"
            >
              Choose Trainer
            </button>
          </div>
    
          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <div className="bg-white p-6 rounded-lg  text-center">
                <h2 className="text-lg font-semibold">Confirm Selection</h2>
                <p className="mt-4">Are you sure you want to choose this trainer?</p>
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={handleConfirm}
                    type="button"
                    disabled={isSubmitting}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                  >
                    {isSubmitting ? "Processing..." : "Confirm"}
                  </button>
                  <button
                    onClick={handleCancel}
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </li>
      );
    };
    
    export default Class;
