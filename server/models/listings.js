import { connectDb } from "./db.js";

const mongoose = await connectDb();

// Schema 
const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'seller' }    
});

// Models
const Listing = mongoose.model('listing', listingSchema, 'listings');

// CRUD functions
export async function createListing(title, description, seller) {
    const newListing = await Listing.create({
        title, 
        description, 
        seller    
    });
    return newListing;
}

export async function findAllListings() {
    return await Listing.find();  
}

export async function findListingById(id) {
    return await Listing.findById(id); 
}

export async function findListingsBySeller(seller) {
    return await Listing.find({ seller });
}

export async function updateListing({ _id, title, description }) {
    await Listing.updateOne({ _id }, { title, description });
    return findListingById(_id);
}

export async function deleteListing(id) {
    return await Listing.deleteOne({ _id: id });
}

export async function deleteAllListings() {
    return await Listing.deleteMany();
}