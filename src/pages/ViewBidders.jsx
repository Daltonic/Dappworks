import React, { useEffect } from 'react'
import { getBidders, getJob } from '../services/blockchain'
import { useParams } from 'react-router-dom'
import { useGlobalState } from '../store'
import { ApplicantsCard, Header } from "../components";

const ViewBidders = () => {
  const { id } = useParams()
  const [bidders] = useGlobalState('bidders')
  const [job] = useGlobalState('job')

  const fetchBidders = async ()=> {
     await getBidders(id)
     await getJob(id)
  }
  
  useEffect(()=> {
    fetchBidders()
  },[])

  return (
    <div>
      <Header />
      <div className="px-20 max-sm:px-4 mt-20">
        <h2 className="text-2xl my-3 px-3">
          {bidders?.length > 0
            ? "Applicants"
            : !job?.listed
            ? "Position filled"
            : "No Applicants yet."}
        </h2>
        {bidders?.length > 0
          ? bidders.map((bidder, i) => (
              <ApplicantsCard key={i} bidder={bidder} />
            ))
          : null}
      </div>
    </div>
  );
}

export default ViewBidders