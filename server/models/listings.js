import { connectDb } from "./db.js";

const mongoose = await connectDb();

// Schema 
const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'seller' }    
});

const listingChatSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'buyer' },    
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'listing' },    
});

// Models
const Listing = mongoose.model('listing', listingSchema, 'listings');
const ListingChat = mongoose.model('listingchat', listingChatSchema, 'listingchats');

// CRUD functions
export async function createListing(title, description, seller) {
    const newListing = await Listing.create({
        title, 
        description, 
        seller   
    });
    return newListing;
}

// find all listings
export async function findAllListings() {
    return await Listing.find();  
}

// find a listing by id
export async function findListingById(id) {
    return await Listing.findById(id); 
}

// find all listings that belong to a specific seller
export async function findListingsBySeller(seller) {
    return await Listing.find({ seller });
}

// update a listing
export async function updateListing({ _id, title, description }) {
    await Listing.updateOne({ _id }, { title, description });
    return findListingById(_id);
}

// find or create a chat for a listing (initiated by a buyer)
export async function findOrCreateChatForListing(listing, buyer) {
    const existingChat = await ListingChat.findOne({buyer, listing})
    if (existingChat) {
        return existingChat
    }
    const newChat = await ListingChat.create({listing, buyer})
    return await ListingChat.findById(newChat._id)
}

// find all chats the buyer is involved in 
export async function findAllChatsForBuyer(buyer) {
    return await ListingChat.find({buyer})
}

// find all chats associated with a listing (for the seller)
export async function findAllChatsForListing(listing) {
    return await ListingChat.find({listing})
}

// add a message to a chat (from the buyer)
export async function addBuyerMessageToChat(chat, message) {
    return
}

// add a message to a chat (from the seller)
export async function addSellerMessageToChat(chat, message) {
    return
}

// find all chats that a seller has not yet responded to
export async function findNewChatsForSeller(seller) {
    return []
}

// find all chats that a buyer has not yet responed to
export async function findNewChatsForBuyer(buyer) {
    return []
}

// goodbye listing
export async function deleteListing(id) {
    await Listing.deleteOne({ _id: id });
}

export async function deleteAllListings() {
    await Listing.deleteMany();
    await ListingChat.deleteMany();
}