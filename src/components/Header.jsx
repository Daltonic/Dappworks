import React from 'react'
import { Link } from 'react-router-dom'
import { connectWallet } from '../services/blockchain'
import { truncate, useGlobalState } from '../store'

const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')

  return (
    <header className="bg-white p-1">
      <main className="w-[96%] mx-auto p-1 flex justify-between items-center flex-wrap">
        <Link className="text-green-600 font-[risque] text-2xl" to={"/"}>
          Dappworks
        </Link>
        <div className="flex items-center space-x-5">
          <span className="text-gray-600">My jobs</span>
          <Link to={"/joblisting/1"} className="text-gray-600">
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
      </main>
    </header>
  );
}

export default Header
