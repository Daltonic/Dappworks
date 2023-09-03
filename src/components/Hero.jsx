import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus } from "react-icons/fa";
import { setGlobalState } from '../store';


const Hero = () => {

  const openModal = ()=> {
    setGlobalState("createModal","scale-100")
  }

  return (
    <section className="min-h-[89vh]">
      <button
        className="p-3 bg-green-500 rounded-full text-white fixed bottom-7 right-2"
        onClick={openModal}
      >
        <FaPlus className="" />
      </button>
      <main className="mt-11 sm:px-11 px-3">
        <div className="p-3">
          <h3 className="text-gray-600 text-2xl border-[1px] rounded-t-lg border-gray-300 py-5 px-3">
            Job listings
          </h3>
          <div className=" border-b border-l border-r border-gray-300 py-3 px-5">
            <h4>Content writer</h4>
            <div className="flex mt-2">Price: 3ETH</div>
            <div className="flex items-center space-x-3 mt-3 text-sm flex-wrap">
              <button className="px-4 py-1 bg-gray-200 rounded-lg">
                Project Management
              </button>
              <button className="px-4 py-1 bg-gray-200 rounded-lg">
                Soft skills
              </button>
            </div>
            <p className="pr-7 mt-5 text-sm">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Accusamus, ex numquam neque assumenda maxime sint quis quos
              dolorem hic similique enim saepe harum expedita sed dolore nam
              maiores earum veritatis.
            </p>
            <div className="text-sm mt-4 flex flex-col">
              <span>Project status: open</span>
            </div>
            <button className="px-4 py-2 bg-green-500 mt-3 text-white rounded-md text-sm">
              Place Your Bid
            </button>
          </div>
          <div className="h-[16rem] border-b border-l border-r border-gray-300"></div>
        </div>
      </main>
    </section>
  );
}

export default Hero
