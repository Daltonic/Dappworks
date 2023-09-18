import React from "react";
import { useGlobalState, setGlobalState } from "../store";
import { MdAttachMoney } from "react-icons/md";
import { toast } from "react-toastify";
import { payout } from "../services/blockchain";

const Payout = () => {
  const [payoutModal] = useGlobalState("payoutModal");
  const [jobListing] = useGlobalState("jobListing");

  const closeModal = () => {
    setGlobalState("payoutModal", "scale-0");
    setGlobalState("jobListing", null);
  };

  const handlePayout = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await payout(jobListing.id)
          .then(async () => {
            closeModal();
            resolve();
          })
          .catch(() => reject());
      }),
      {
        pending: "Approve transaction...",
        success: "payment successfully 👌",
        error: "Encountered error 🤯",
      }
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${payoutModal}`}
    >
      <div className="bg-white text-black rounded-xl w-11/12 md:w-2/5 h-7/12 px-6 py-3">
        <div className="relative">
          <div>
            <div className="text-center flex justify-center items-center p-2 my-3">
              <MdAttachMoney className="text-3xl text-blue-600" />
            </div>
            <p className="text-center my-1">
              Are you sure, you want to initiate this payment?
            </p>
            <div className="flex justify-between items-center mt-5">
              <button
                onClick={closeModal}
                className="py-1 px-4 bg-green-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePayout}
                className="py-1 px-4 bg-blue-600 text-white rounded-md"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payout;
