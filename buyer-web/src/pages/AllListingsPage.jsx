import { useEffect, useState } from "react"
import { getAllListings } from "../api"
import Header from "../components/Header";

import './Page.css'
import './AllListingsPage.css'
import { useNavigate } from "react-router";

function ListingView({ listing }) {
    const navigate = useNavigate()
    return (
        <div>
            <div className="listing-header"> 
                <h3>{listing.title}</h3>
                <button onClick={() => navigate(`/listing/${listing._id}`)}>VIEW</button>
            </div>
        </div>
    )
}
export default function AllListingsPage() {
    const [listings, setListings ] = useState([])
        
    async function loadListings() {
        const listings = await getAllListings()
        setListings(listings)
    }

    useEffect(() => {
        loadListings()
    }, [])

    return (
        <div className="page">
            <Header />
            <div className="h-pad">
                <div className="listing-header">
                    <h1>All Listings</h1>
                </div>
                { listings.map((listing) => (
                    <ListingView key={listing._id} listing={listing} />
                ))}
            </div>
        </div>
    )
}