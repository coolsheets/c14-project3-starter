import { Link } from "react-router";

export default function SplashPage() {
    return (
        <div>
            <h1>Hallo!</h1>
            <Link to="signup">Sign up</Link>
            <Link to="buyers">See Buyers</Link>
        </div>
    )
}