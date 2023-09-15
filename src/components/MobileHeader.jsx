import React from 'react'
import { Link } from "react-router-dom";
import { connectWallet } from "../services/blockchain";
import { truncate, useGlobalState } from '../store';

const MobileHeader = ({ toggle }) => {
  const [connectedAccount] = useGlobalState("connectedAccount");

  return (
    <section
      className={`md:hidden block absolute top-5 right-0 py-3 px-4 bg-white shadow-lg rounded-md ${
        toggle ? "visible" : "invisible"
      }`}
    >
      <div className="flex flex-col space-y-3">
        <Link to={"/mybids"} className="text-gray-600">
          My Bids
        </Link>
        <Link to={"/myjobs"} className="text-gray-600">
          My Jobs
        </Link>
        <Link to={"/myprojects"} className="text-gray-600">
          My Projects
        </Link>

        {connectedAccount ? (
          <button className="bg-green-500 text-white py-1 px-5 rounded-sm">
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        ) : (
          <button
            className="bg-green-500 text-white py-1 px-5 rounded-full"
            onClick={connectWallet}
          >
            connect wallet
          </button>
        )}
      </div>
    </section>
  );
}

export default MobileHeader
