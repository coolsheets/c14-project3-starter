import { useState } from "react"
import { signUp } from "../api"
import { useNavigate } from "react-router"

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
        navigate('/buyers')
    }

    return (
        <div>
            <h1>Signup</h1>
            <label>Username</label>
            <input value={username} onChange={updateUsername}/>
            <label>Email Address</label>
            <input value={email} onChange={updateEmail}/>
            <label>Password</label>
            <input value={password} type="password" onChange={updatePassword}/>
            <button onClick={doSignUp}>Sign up!</button>
        </div>
    )
}