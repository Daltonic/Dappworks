import React, { useEffect } from 'react'
import { truncate, useGlobalState } from '../store';
import { acceptBid, getBidders } from '../services/blockchain';
import { toast } from 'react-toastify';
import ChatButton from "./ChatButton";

const ApplicantsCard = ({ bidder }) => {
  const [job] = useGlobalState('job')
  
  const handleAcceptingBid = async (bid, jid, account)=> {
    await toast.promise(new Promise(async (resolve, reject) => {
        await acceptBid(bid, jid, account)
          .then(async () => {
            await getBidders(jid);
            resolve();
          })
          .catch(() => reject());
    }), {
      pending: "Approve transaction...",
      success: "bid accepted successfully 👌",
      error: "Encountered error 🤯",
    });
  }

  return (
    <div className="my-3 bg-white shadow-lg p-3 rounded-lg flex justify-between items-center border-[1px] border-gray-300">
      <h4>{truncate(bidder.account, 4, 4, 11)}</h4>
      <div className="flex items-center space-x-3">
        <ChatButton 
          label={'Message'} 
          className={'flex items-center space-x-1 px-4 py-1 rounded-full bg-blue-500 text-white'} 
          job={job}
          recipient={bidder.account}
        />
        <button
          onClick={() =>
            handleAcceptingBid(bidder.id, bidder.jId, bidder.account)
          }
          className="py-1 px-5 rounded-full bg-green-500 text-white"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

export default ApplicantsCard
