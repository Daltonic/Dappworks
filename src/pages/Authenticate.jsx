import { toast } from 'react-toastify'
import { Header } from '../components'
import { loginWithCometChat, signUpWithCometChat } from '../services/chat'
import { setGlobalState, useGlobalState } from '../store'
import { useNavigate } from 'react-router-dom'

const Authenticate = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const navigate = useNavigate()

  const handleSignUp = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await signUpWithCometChat(connectedAccount)
          .then((user) => resolve(user))
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Signing up...',
        success: 'Signed up successfully, please login 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleLogin = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await loginWithCometChat(connectedAccount)
          .then((user) => {
            setGlobalState('currentUser', user)
            navigate('/messages')
            resolve(user)
          })
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Logging...',
        success: 'Logged in successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <>
      <Header />

      <div className="w-full sm:w-3/5 mx-auto mt-8 px-3">
        <h1 className="text-2xl font-bold text-center">Chats Authentication</h1>
        <p className="text-center">
          Login or sign up to chat with your client.
        </p>

        <div className="flex justify-center items-center space-x-3 mt-5">
          <button
            onClick={handleLogin}
            className="flex justify-center items-center space-x-1 py-1 px-5 rounded-full
          bg-blue-500 text-white max-sm:text-sm"
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            className="py-1 px-5 rounded-full bg-green-500 text-white max-sm:text-sm"
          >
            Sign up
          </button>
        </div>
      </div>
    </>
  )
}

export default Authenticate
