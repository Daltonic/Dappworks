import React from 'react'
import { FaEthereum } from 'react-icons/fa';

const JobListingCard = ({ jobListing }) => {
  return (
    <div className="border-b border-l border-r border-gray-300 py-3 px-5">
      <h4>{jobListing.jobTitle}</h4>
      <div className="flex mt-2 items-center">
        <FaEthereum className="text-md cursor-pointer" />
        <span className="text-md">{jobListing.price}</span>
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
        <span>Project status: {jobListing.status}</span>
      </div>
      <button className='bg-green-500 px-3 py-1 text-sm text-white rounded-md mt-5'>Place Bid</button>
    </div>
  );
}

export default JobListingCard
