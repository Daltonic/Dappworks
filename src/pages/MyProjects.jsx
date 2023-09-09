import React, { useEffect } from 'react'
import { Header, JobListingOwnerActions } from '../components'
import { getMyJobs } from '../services/blockchain'
import { useGlobalState } from '../store'
import UpdateJob from '../components/UpdateJob'
import DeleteJob from '../components/DeleteJob'

const MyProjects = () => {
  const [myjobs] = useGlobalState('myjobs')
  const [connectedAccount] = useGlobalState('connectedAccount')

  const fetchData = async ()=> {
    await getMyJobs()
  }

  useEffect(()=> {
    fetchData()
  },[])

  return (
    <div>
      <Header />
      <div className='px-5 mt-7'>
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
          </>
        )}
      </div>
    </div>
  )
}

export default MyProjects
