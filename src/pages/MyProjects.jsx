import React, { useEffect } from 'react'
import { 
  DeleteJob, 
  Header, 
  JobListingOwnerActions, 
  Payout, 
  UpdateJob 
} from '../components'
import { getMyJobs } from '../services/blockchain'
import { useGlobalState } from '../store'

const MyProjects = () => {
  const [myjobs] = useGlobalState('myjobs')
  const [connectedAccount] = useGlobalState('connectedAccount')

  
  useEffect(()=> {
    const fetchData = async ()=> {
      await getMyJobs()
    }

    fetchData()
  },[])

  return (
    <div>
      <Header />
      <div className='px-5 my-7'>
        {
          myjobs.length > 0
          ? myjobs.map((myjob,i) => (
            <JobListingOwnerActions key={i} jobListing={myjob} editable={myjob.owner == connectedAccount} />
          ))
          : (
            <h2 className='text-lg text-gray-500'>No Posted Jobs Yet</h2>
          )
        }
        {myjobs && (
          <>
           <UpdateJob />
           <DeleteJob />
           <Payout />
          </>
        )}
      </div>
    </div>
  )
}

export default MyProjects
