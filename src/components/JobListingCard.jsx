import React, { useEffect, useState } from 'react'
import { FaEthereum } from 'react-icons/fa';
import { bidForJob, bidStatus } from "../services/blockchain";
import { toast } from 'react-toastify';
import { useGlobalState } from '../store';

const JobListingCard = ({ jobListing }) => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [status] = useGlobalState('status')

  const handleBidding = async (id) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await bidForJob(id)
          .then(async () => {
            await bidStatus(id);
            resolve();
          })
          .catch(() => reject());
      }),
      {
            pending: "Approve transaction...",
            success: "Application successful 👌",
            error: "Encountered error 🤯",
      }
    );
  };

  const chk = async ()=> {
    await bidStatus(jobListing.id.toNumber())
  }

  useEffect(()=>{

  },[])

  return (
    <div className="border-b border-l border-r border-gray-300 py-6 px-5">
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
      <div className="text-sm mt-4 flex flex-col">
        <span>Project status: {jobListing.listed ? "open" : "closed"}</span>
      </div>
      {connectedAccount != jobListing.owner && !status ? (
        <button
          onClick={() => handleBidding(jobListing.id)}
          className="bg-green-500 px-3 py-1 text-sm text-white rounded-md mt-5"
        >
          Place Bid
        </button>
      ) : connectedAccount != jobListing.owner && status ? (
        <button className="mt-5 text-sm bg-green-200 px-3 py-2 rounded-sm text-gray-600">
          Your request is pending
        </button>
      ) : (
        <button className="mt-5 text-sm bg-green-400 px-3 py-2 rounded-sm text-white">
          View job bidders
        </button>
      )}
    </div>
  )
}

export default JobListingCard
