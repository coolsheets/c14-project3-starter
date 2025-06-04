import { useState } from "react"
import { signUp } from "../api"
import { useNavigate } from "react-router"

import './Page.css'

export default function SignupPage() {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function updateUsername(e) {
        setUsername(e.target.value)
    }

    function updateEmail(e) {
        setEmail(e.target.value)
    }

    function updatePassword(e) {
        setPassword(e.target.value)
    }

    async function doSignUp(e) {
       console.log('Doing the signup with ', username, email, password) 
        await signUp(username, email, password)
        navigate('/login')
    }

    return (
        <div className="page h-centered  v-centered gapped">
            <h1>Sign up</h1>
            <div>Welcome to Seller Marketplace!</div>
            <input placeholder="Username" value={username} onChange={updateUsername}/>
            <input placeholder="Email" value={email} onChange={updateEmail}/>
            <input placeholder="Password" value={password} type="password" onChange={updatePassword}/>
            <button onClick={doSignUp}>SIGN UP</button>
        </div>
    )
}