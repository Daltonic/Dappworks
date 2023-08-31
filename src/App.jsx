import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'

const App = () => {

  return (
    <div className="min-h-screen font-[poppins]">
      <Routes>
        <Route path="/" element={<Home />} />
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
  )
}

export default App
