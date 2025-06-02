import { useEffect, useState } from "react"
import { getAllBuyers } from "../api"
import { useLogin } from "../LoginContext";
import { Link } from "react-router";

export default function AllBuyersPage() {
    const [buyers, setBuyers ] = useState([])

    const { isLoggedIn, user } = useLogin();
        
    async function loadBuyers() {
        const buyers = await getAllBuyers()
        setBuyers(buyers)
    }

    useEffect(() => {
        loadBuyers()
    }, [])

    return (
        <div>
            <h1>All Buyers</h1>
            { isLoggedIn && <div> hello {user.username}</div>}
            { !isLoggedIn && <Link to="/login">Log in</Link>}

            <ol> 
                { buyers.map((buyer) => (
                    <li key={buyer._id}>{buyer.username}</li>
                ))}
            </ol>
        </div>
    )
}