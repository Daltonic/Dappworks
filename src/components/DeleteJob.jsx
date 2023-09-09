import React from 'react'
import { useGlobalState, setGlobalState } from '../store';
import {
  FaTrashAlt,
} from "react-icons/fa";
import { toast } from 'react-toastify';
import { deleteJob, getMyJobs } from '../services/blockchain';

const DeleteJob = () => {
  const [deleteModal] = useGlobalState('deleteModal')
  const [jobListing] = useGlobalState("jobListing");

  const closeModal = ()=> {
    setGlobalState('deleteModal', 'scale-0')
    setGlobalState('jobListing', null)
  }

  const handleDelete = async ()=> {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await deleteJob(jobListing.id)
          .then(async () => {
            closeModal();
            await getMyJobs();
            resolve();
          })
          .catch(() => reject());
      }),
      {
        pending: "Approve transaction...",
        success: "job deleted successfully 👌",
        error: "Encountered error 🤯",
      }
    );
  }
  
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${deleteModal}`}
    >
      <div className="bg-white text-black rounded-xl w-11/12 md:w-2/5 h-7/12 px-6 py-3">
        <div className="relative">
          <div>
            <div className="text-center flex justify-center items-center p-2 my-3">
              <FaTrashAlt className="text-2xl text-red-500" />
            </div>
            <p className="text-center my-1">
              Are you sure, you want to delete this?
            </p>
            <h4 className="text-sm text-center">This action can't be undone</h4>
            <div className="flex justify-between items-center mt-5">
              <button
                onClick={closeModal}
                className="py-1 px-4 bg-green-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="py-1 px-4 bg-red-500 text-white rounded-md"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteJob
