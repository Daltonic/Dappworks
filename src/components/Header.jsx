import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connectWallet } from '../services/blockchain'
import { truncate, useGlobalState } from '../store'
import { BsList, BsX } from "react-icons/bs";
import MobileHeader from './MobileHeader';


const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = ()=> {
    setIsOpen(!isOpen)
  }


  return (
    <header className="bg-white p-1">
      <main className="w-[96%] mx-auto p-1 flex justify-between items-center flex-wrap">
        <Link className="text-green-600 font-[risque] text-2xl" to={"/"}>
          Dappworks
        </Link>
        <div className="flex items-center space-x-5 md:block hidden">
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
            <button className="bg-green-500 text-white py-1 px-5 rounded-full">
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

        <div className="md:hidden block relative" onClick={handleToggle}>
          {!isOpen ? (
            <BsList className="text-2xl cursor-pointer" />
          ) : (
            <BsX className="text-2xl cursor-pointer" />
          )}
          <MobileHeader toggle={isOpen} />
        </div>
      </main>
    </header>
  );
}

export default Header
