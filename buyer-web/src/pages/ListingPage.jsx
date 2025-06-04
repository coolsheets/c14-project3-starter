
import { getListing } from '../api'
import { Link, useParams } from 'react-router'
import Header from '../components/Header'
import './Page.css'
import { useState, useEffect } from 'react'

export default function ListingPage() {

    const { listingId } = useParams()
    const [listing, setListing] = useState()

    useEffect(() => {
        getListing(listingId).then(setListing)
    }, [listingId])

    return (
        <div className="page h-centered gapped">
            <Header />
            {!listing && <div>Loading...</div>}
            {listing && <>
                <h1>{listing.title}</h1>
                <div>{listing.description}</div>
            </>}
            <Link to="/">Back</Link>
        </div>
    );
}
