
import { getListing, getSeller } from '../api'
import { Link, useParams } from 'react-router'
import Header from '../components/Header'
import './Page.css'
import { useState, useEffect } from 'react'

export default function ListingPage() {

    const { listingId } = useParams()
    const [listing, setListing] = useState()
    const [seller, setSeller] = useState()

    useEffect(() => {
        getListing(listingId).then(setListing)
    }, [listingId])

    useEffect(() => {
        if (listing) {
            getSeller(listing.seller).then(setSeller)
        }
    }, [listing?.seller])

    return (
        <div className="page gapped">
            <Header />
            {!listing && <div>Loading...</div>}
            {listing && <div className="h-centered-column">
                <h1>{listing.title}</h1>
                <div>{listing.description}</div>
                {seller && <div>For sale by: { seller.username }</div> }
                <Link to="/">Back</Link>
            </div>}
        </div>
    );
}
