import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus } from "react-icons/fa";
import { useGlobalState, setGlobalState } from '../store';
import JobListingCard  from './JobListingCard'
import { getJobs } from '../services/blockchain';
import { jobs } from '../store/data';


const Hero = () => {
  const [jobs] = useGlobalState('jobs')

  const loadData = async ()=> {
    await getJobs()
  }

  useEffect(()=> {
    loadData()
  },[])
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
            {
              jobs.length > 0 ? 'Job listings' : 'No jobs yet'
            } 
          </h3>
          {
            jobs.length > 0 
            ? jobs.map((job, i) => (
              <JobListingCard key={i} jobListing={job}/>
            ))
            : null
          }
      </div>
      </main>
    </section>
  );
}

export default Hero
