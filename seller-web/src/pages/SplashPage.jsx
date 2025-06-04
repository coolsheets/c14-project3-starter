import { Link } from "react-router";
import { useLogin } from "../LoginContext";

import './Page.css'

export default function SplashPage() {
    return (
        <div className="page h-centered v-centered">
            <h1>Welcome to Seller Marketplace!</h1>
            <Link to="login"><button>LOGIN</button></Link>
            <div>-- or --</div>
            <Link to="signup"><button>SIGN UP</button></Link>
        </div>
    )
}