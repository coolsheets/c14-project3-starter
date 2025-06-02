import { useEffect, useState } from "react"
import { getAllBuyers } from "../api"
import { useLogin } from "../LoginContext";
import Header from "../components/Header";

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
            <Header />
            <h1>All Buyers</h1>
            <ol> 
                { buyers.map((buyer) => (
                    <li key={buyer._id}>{buyer.username}</li>
                ))}
            </ol>
        </div>
    )
}