import { Link } from "react-router";
import Header from "../components/Header";

export default function SplashPage() {


    return (
        <div>
            <Header />
            <h1>Hallo!</h1>
            <Link to="signup">Sign up</Link>
            <Link to="buyers">See Buyers</Link>
        </div>
    )
}