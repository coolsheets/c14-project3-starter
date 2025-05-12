import { useState } from "react"
import { signUp } from "../api"
import { useNavigate } from "react-router"

export default function SignupPage() {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')

    function updateUsername(e) {
        setUsername(e.target.value)
    }

    function updateEmail(e) {
        setEmail(e.target.value)
    }

    async function doSignUp(e) {
       console.log('Doing the signup with ', username, email) 
        await signUp(username, email)
        navigate('/buyers')
    }

    return (
        <div>
            <h1>Signup</h1>
            <label>Username</label>
            <input value={username} onChange={updateUsername}/>
            <label>Email Address</label>
            <input value={email} onChange={updateEmail}/>
            <button onClick={doSignUp}>Sign up!</button>
        </div>
    )
}