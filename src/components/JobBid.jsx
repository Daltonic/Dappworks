import React from 'react'
import { FaEthereum } from 'react-icons/fa';
import { BsChatDotsFill } from "react-icons/bs";
import { useGlobalState, setGlobalState } from "../store";
import ChatButton from './ChatButton';

const JobBid = ({ jobListing }) => {

  return (
    <div className="border-t border-b border-l border-r border-gray-300 py-6 px-5">
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
      <div className="flex items-center mt-3">
        <ChatButton
          className={
            "flex items-center space-x-1 px-4 py-1 rounded-full bg-blue-500 text-white"
          }
          label={"Chats"}
          job={jobListing}
        />
      </div>
    </div>
  );
}

export default JobBid
