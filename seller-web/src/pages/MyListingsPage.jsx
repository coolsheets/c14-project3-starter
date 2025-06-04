import { useEffect, useState } from "react"
import { getMyListings } from "../api"
import Header from "../components/Header";

import './Page.css'
import './MyListingsPage.css'
import { useNavigate } from "react-router";

function ListingView({ listing }) {
    return (
        <div>
            <div className="listing-header"> 
                <h3>{listing.title}</h3>
                <div><button>EDIT</button> <button>DELETE</button></div>
            </div>
            <div>{listing.description}</div>
        </div>
    )
}
export default function MyListingsPage() {
    const [listings, setListings ] = useState([])
        
    const navigate = useNavigate()

    async function loadListings() {
        const listings = await getMyListings()
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
                    <h1>My Listings</h1>
                    <button className="add-button" onClick={() => navigate('/new-listing')}>+ Add Listing</button>
                </div>
                { listings.map((listing) => (
                    <ListingView key={listing._id} listing={listing} />
                ))}
            </div>
        </div>
    )
}