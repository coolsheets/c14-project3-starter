import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'

import { LoginProvider } from './LoginContext'

import AllBuyersPage from './pages/AllBuyersPage'
import SignupPage from './pages/SignupPage'
import SplashPage from './pages/SplashPage'
import LoginPage from './pages/LoginPage'



function App() {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/buyers" element={<AllBuyersPage />} />
          <Route path="/" index element={<SplashPage />} />
        </Routes>
      </LoginProvider>
    </BrowserRouter>
  )
}

export default App
