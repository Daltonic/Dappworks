import React from "react";
import {
  FaEthereum,
  FaPenAlt,
  FaTrashAlt,
  FaExclamationCircle,
  FaMoneyBill,
} from "react-icons/fa";
import { useGlobalState, setGlobalState } from "../store";

const JobListingOwnerActions = ({ jobListing, editable }) => {

  const openUpdateModal = ()=> {
    setGlobalState('updateModal', 'scale-100')
    setGlobalState("jobListing", jobListing);
  }

  const openDeleteModal = ()=> {
    setGlobalState('deleteModal', 'scale-100')
    setGlobalState("jobListing", jobListing);
  }

  return (
    <div className="border-t border-b border-l border-r border-gray-300 py-3 px-5 mt-2">
      <h4>{jobListing.jobTitle}</h4>
      <div className="flex mt-2 items-center">
        <FaEthereum className="text-md cursor-pointer" />
        <span className="text-md">{jobListing.prize}</span>
      </div>
      <div className="flex items-center mt-3 text-sm flex-wrap gap-3">
        {jobListing.tags.length > 0
          ? jobListing.tags.map((tag, i) => (
              <button key={i} className="px-4 py-1 bg-gray-200 rounded-lg mr-2">
                {tag}
              </button>
            ))
          : null}
      </div>
      <p className="pr-7 mt-5 text-sm">{jobListing.description}</p>
      <div className="flex space-x-2">
        {editable && !jobListing.paidout && (
          <div className="flex mt-5 space-x-3">
            <button
              onClick={openUpdateModal}
              className="flex items-center px-3 py-1 border-[1px] border-green-500 text-green-500 space-x-2 rounded-md"
            >
              <FaPenAlt />
              <span className="text-sm">Update</span>
            </button>
            <button
              onClick={openDeleteModal}
              className="flex items-center px-2 py-1 border-[1px] border-red-500 text-red-500 space-x-2 rounded-md text-sm"
            >
              <FaTrashAlt />
              <span className="text-sm">Delete</span>
            </button>
            <button className="flex items-center px-3 py-1 border-[1px] border-amber-500 text-amber-500 space-x-2 rounded-md">
              <FaExclamationCircle />
              <span className="text-sm">Dispute</span>
            </button>
            <button className="flex items-center px-3 py-1 border-[1px] border-sky-500 text-sky-500 space-x-2 rounded-md">
              <FaMoneyBill />
              <span className="text-sm">Pay</span>
            </button>
          </div>
        )}

        {editable && jobListing.paidout && (
          <div>
            <button>Paid Out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListingOwnerActions;
