import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'

import AllBuyersPage from './pages/AllBuyersPage'
import SignupPage from './pages/SignupPage'
import SplashPage from './pages/SplashPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/buyers" element={<AllBuyersPage />} />
        <Route path="/" index element={<SplashPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
