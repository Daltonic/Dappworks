import { Routes, Route } from 'react-router-dom'
import { Home, JobListing } from './pages'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { isWalletConnected, getJobs } from './services/blockchain'

const App = () => {
  const fetchData = async ()=> {
    await isWalletConnected()
    await getJobs()
  }

  useEffect(()=> {
    fetchData()
  })
  return (
    <div className="min-h-screen font-[poppins]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/joblisting/:id" element={<JobListing />} />
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App
