import { Link } from "react-router";
import { useLogin } from "../LoginContext";

export default function SplashPage() {

    const { isLoggedIn, user } = useLogin();

    return (
        <div>
            <h1>Hallo!</h1>
            { isLoggedIn && <div> hello {user.username}</div>}
            { !isLoggedIn && <Link to="login">Log in</Link>}
            <Link to="signup">Sign up</Link>
            <Link to="buyers">See Buyers</Link>
        </div>
    )
}