import React, { useEffect } from 'react'
import { Header, JobBid } from '../components'
import { useGlobalState } from '../store'
import { getMyGigs } from "../services/blockchain";

const MyJobs = () => {
  const [mygigs] = useGlobalState("mygigs");

  const fetchData = async ()=> {
    await getMyGigs();
  }
  useEffect(()=>{
    fetchData()
  },[])
  return (
    <div className="">
      <Header />
      <div className="mt-11 px-4">
        <h3 className="text-xl px-4 my-4">
          {mygigs.length > 0
            ? "Assigned Tasks."
            : "You Don't Have Any Assigned task."}
        </h3>
        <div className="px-3">
          {mygigs.length > 0
            ? mygigs.map((mygig, i) => <JobBid key={i} jobListing={mygig} />)
            : null}
        </div>
      </div>
    </div>
  );
}

export default MyJobs
