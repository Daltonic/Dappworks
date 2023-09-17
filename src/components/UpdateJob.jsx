import React, { useEffect, useState } from 'react'
import { setGlobalState, truncate, useGlobalState } from '../store'
import { FaTimes } from 'react-icons/fa'
import { getMyJobs, updateJob } from '../services/blockchain'
import { toast } from 'react-toastify'

const UpdateJob = () => {
  const [jobListing] = useGlobalState('jobListing')
  const [jobTitle, setJobTitle] = useState('')
  const [prize, setPrize] = useState('')
  const [description, setDescription] = useState('')
  const [skill, setSkill] = useState('')
  const [skills, setSkills] = useState([])
  const [updateModal] = useGlobalState('updateModal')

  useEffect(() => {
    setJobTitle(jobListing?.jobTitle)
    setPrize(jobListing?.prize)
    setDescription(jobListing?.description)
    setSkills(jobListing?.tags)
  }, [jobListing])

  const addSkills = () => {
    if (skills.length != 5) {
      setSkills((prevState) => [...prevState, skill])
    }
    setSkill('')
  }

  const removeSkill = (index) => {
    skills.splice(index, 1)
    setSkills(() => [...skills])
  }

  const closeModal = () => {
    setGlobalState('updateModal', 'scale-0')
    setJobTitle('')
    setPrize('')
    setDescription('')

    setGlobalState('jobListing', null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (jobTitle == '' || prize == '' || skills.length < 3 || description == '')
      return
    const params = {
      id: jobListing.id,
      jobTitle,
      description,
      tags: skills.slice(0, 5).join(','),
      description,
      prize,
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await updateJob(params)
          .then(async () => {
            closeModal()
            await getMyJobs()
            resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'job updated successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${updateModal}`}
    >
      <div className="bg-white text-black shadow-md shadow-green-500 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="relative">
          <button
            onClick={closeModal}
            className="border-0 bg-transparent focus:outline-none absolute -top-2 -right-2"
          >
            <FaTimes />
          </button>
          <div>
            <h3 className="text-xl mb-8">Update Job</h3>
            <form className="" onSubmit={handleSubmit}>
              <div className="mb-5 flex flex-col space-y-1">
                <label htmlFor="jt">Job Title</label>
                <input
                  id="jt"
                  value={jobTitle}
                  placeholder="e.g. content writer..."
                  type="text"
                  className="rounded-md text-sm"
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5 flex flex-col space-y-1">
                <label htmlFor="desc">Prize</label>
                <input
                  id="number"
                  value={prize}
                  placeholder="eg. 0.04"
                  step={0.0001}
                  type="text"
                  className="rounded-md text-sm bg-gray-200"
                  onChange={(e) => setPrize(e.target.value)}
                  disabled
                  readOnly
                />
              </div>

              <div className="mb-1 flex flex-col space-y-1 relative">
                <label htmlFor="desc">Featured skills</label>
                <input
                  id="number"
                  step={0.0001}
                  type="text"
                  value={skill}
                  className="rounded-md text-sm"
                  placeholder="Range (3 - 5) skills"
                  onChange={(e) => setSkill(e.target.value)}
                />
                {skills?.length != 5 ? (
                  <button
                    className="absolute top-[29px] right-1 py-1 px-4 bg-green-500 text-white text-sm rounded-md"
                    onClick={addSkills}
                  >
                    add
                  </button>
                ) : null}
              </div>
              <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 rounded-xl mt-2 mb-4 ">
                {skills?.map((skill, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-full text-gray-500 bg-gray-200 font-semibold
                flex items-center w-max cursor-pointer active:bg-gray-300
                transition duration-300 ease space-x-2 text-xs mr-2 mt-2"
                  >
                    <span>{truncate(skill, 4, 4, 11)}</span>
                    <button
                      onClick={() => removeSkill(i)}
                      type="button"
                      className="bg-transparent hover focus:outline-none"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mb-5 flex flex-col space-y-1">
                <label htmlFor="desc">Description</label>
                <textarea
                  id="desc"
                  value={description}
                  type="text"
                  placeholder="write something beautiful..."
                  className="rounded-b-md focus:outline-none focus:ring-0 text-sm"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>
                <button className="px-9 py-2 bg-green-500 text-white rounded-md">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateJob
