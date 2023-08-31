import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {

  return (
    <header className="bg-white p-1">
      <main className="w-[96%] mx-auto p-1 flex justify-between items-center flex-wrap">
        <Link className='text-green-600 font-[risque] text-2xl' to={'/'}>Dappworks</Link>
        <div className='flex items-center space-x-5'>
          <button 
            className='bg-green-600 text-white py-1 px-5 rounded-full'
          >
            connect wallet
          </button>

        </div>
      </main>
    </header>
  );
}

export default Header
