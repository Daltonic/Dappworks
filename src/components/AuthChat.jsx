import React from 'react'
import { useGlobalState, setGlobalState } from '../store'
import ChatButton from './ChatButton'
import { FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AuthChat = () => {
  const [chatAuthModal] = useGlobalState('chatAuthModal')
  const navigate = useNavigate()

  const closeModal = () => {
    navigate('/')
    setGlobalState('chatAuthModal', 'scale-0')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${chatAuthModal}`}
    >
      <div className="bg-white text-black rounded-xl w-11/12 md:w-2/5 h-7/12 px-6 py-3">
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="border-0 bg-transparent focus:outline-none"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex justify-center">
          <ChatButton job={null} />
        </div>
      </div>
    </div>
  )
}

export default AuthChat
