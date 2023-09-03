import React from 'react'
import { setGlobalState, useGlobalState } from '../store'
import { FaTimes } from 'react-icons/fa'

const CreateJob = () => {
    const [createModal] = useGlobalState('createModal')

    const closeModal = () => {
      setGlobalState("createModal", "scale-0");
    };

    const handleSubmit = (e)=> {
        e.preventDefault()
    }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${createModal}`}
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
            <h3 className="text-xl mb-8">Create a Job</h3>
            <form className="" onSubmit={handleSubmit}>
              <div className="mb-5 flex flex-col space-y-1">
                <label htmlFor="jt">Job Title</label>
                <input
                  id="jt"
                  placeholder="e.g. content writer..."
                  type="text"
                  className="rounded-md text-sm"
                />
              </div>

              <div className="mb-5 flex flex-col space-y-1">
                <label htmlFor="desc">Price</label>
                <input
                  id="number"
                  placeholder="eg. 0.04"
                  step={0.0001}
                  type="text"
                  className="rounded-md text-sm"
                />
              </div>

              <div className="mb-5 flex flex-col space-y-1 relative">
                <label htmlFor="desc">Featured skills</label>
                <input
                  id="number"
                  step={0.0001}
                  type="text"
                  className="rounded-md text-sm"
                  placeholder='maximum of 5 skills required'
                />
                <button className='absolute top-[29px] right-1 py-1 px-4 bg-green-500 text-white text-sm rounded-md'>add</button>
              </div>

              <div className="mb-5 flex flex-col space-y-1">
                <label htmlFor="desc">Description</label>
                <textarea
                  id="desc"
                  type="text"
                  placeholder='write something beautiful...'
                  className="rounded-b-md focus:outline-none focus:ring-0 text-sm"
                ></textarea>
              </div>
              <div>
                <button className="px-9 py-2 bg-green-500 text-white rounded-md">
                  create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateJob
