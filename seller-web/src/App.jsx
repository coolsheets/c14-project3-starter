import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'

import { LoginProvider, useLogin } from './LoginContext'

import MyListingsPage from './pages/MyListingsPage'
import NewListingPage from './pages/NewListingPage'
import SignupPage from './pages/SignupPage'
import SplashPage from './pages/SplashPage'
import LoginPage from './pages/LoginPage'

function LoggedInRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<MyListingsPage />} />
      <Route path="/new-listing" index element={<NewListingPage />} />
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
