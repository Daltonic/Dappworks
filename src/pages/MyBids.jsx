import React, { useEffect } from 'react'
import { ChatAuth, Header, JobBid } from "../components";
import { getMyBidJobs } from '../services/blockchain';
import { useGlobalState } from '../store';

const MyBids = () => {
  const [mybidjobs] = useGlobalState("mybidjobs");

  const fetchData = async ()=> {
    await getMyBidJobs()
  }

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <div className="">
      <Header />
      <div className="mt-11 px-4">
        <h3 className="text-xl px-4 my-4">
          {mybidjobs.length > 0
            ? "Jobs You Applied For."
            : "You Haven't Bid on Any Jobs Yet."}
        </h3>
        <div className="px-3">
          {mybidjobs.length > 0
            ? mybidjobs.map((mybidjob, i) => (
                <JobBid key={i} jobListing={mybidjob} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default MyBids
