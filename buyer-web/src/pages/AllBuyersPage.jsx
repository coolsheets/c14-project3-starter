import { useEffect, useState } from "react"
import { getAllBuyers } from "../api"

export default function AllBuyersPage() {
    const [buyers, setBuyers ] = useState([])

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
            <ol> 
                { buyers.map((buyer) => (
                    <li key={buyer._id}>{buyer.username}</li>
                ))}
            </ol>
        </div>
    )
}