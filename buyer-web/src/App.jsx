import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'

import { LoginProvider, useLogin } from './LoginContext'

import SignupPage from './pages/SignupPage'
import SplashPage from './pages/SplashPage'
import LoginPage from './pages/LoginPage'
import AllListingsPage from './pages/AllListingsPage'
import ListingPage from './pages/ListingPage'

function LoggedInRoutes() {
  return (
    <Routes>
      <Route path="/listing/:listingId" element={<ListingPage />} />
      <Route path="/" index element={<AllListingsPage />} />
    </Routes>
  )  
}

function NotLoggedInRoutes () {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" index element={<SplashPage />} />
    </Routes>
  )
}

function AppRoutes() {
  const {isLoggedIn} = useLogin()
  return isLoggedIn ? <LoggedInRoutes/> : <NotLoggedInRoutes />
}

function App() {
  return (
    <BrowserRouter>
      <LoginProvider>
        <AppRoutes />
      </LoginProvider>
    </BrowserRouter>
  )
}

export default App
