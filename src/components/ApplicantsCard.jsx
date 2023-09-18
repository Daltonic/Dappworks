import React from 'react'
import { truncate } from '../store'
import { acceptBid } from '../services/blockchain'
import { toast } from 'react-toastify'
import { MdOutlineChat } from 'react-icons/md'
import { Link } from 'react-router-dom'

const ApplicantsCard = ({ bidder }) => {
  const handleAcceptingBid = async (bid, jid, account) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await acceptBid(bid, jid, account)
          .then(async () => resolve())
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'bid accepted successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className="my-3 bg-white shadow-lg p-3 rounded-lg flex justify-between
    items-center border-[1px] border-gray-300 flex-wrap"
    >
      <h4>{truncate(bidder.account, 4, 4, 11)}</h4>
      <div className="flex items-center space-x-3">
        <Link
          to={`/chats/${bidder.account}`}
          className="flex justify-center items-center space-x-1 py-1 px-5 rounded-full
          bg-blue-500 text-white max-sm:text-sm"
        >
          <MdOutlineChat size={20} />
          <span>Chat</span>
        </Link>
        <button
          onClick={() =>
            handleAcceptingBid(bidder.id, bidder.jId, bidder.account)
          }
          className="py-1 px-5 rounded-full bg-green-500 text-white max-sm:text-sm"
        >
          Accept
        </button>
      </div>
    </div>
  )
}

export default ApplicantsCard
