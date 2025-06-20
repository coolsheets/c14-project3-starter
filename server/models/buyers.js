import bcrypt from 'bcryptjs';
import { connectDb } from "./db.js";

const mongoose = await connectDb();

//
// Authenticated with GPT's help:
// https://chatgpt.com/share/683e1844-9568-8013-92ad-7583dbd4e9ab
//

// Schema 
const buyerSchema = new mongoose.Schema({
    username: String,
    email: String,
    pwhash: {
        type: String,
        required: false,
        select: false  // Hide pwhash from queries by default
    },
    favorites: [ { type: mongoose.Schema.Types.ObjectId, ref: 'listing' } ]
});

// Models
const Buyer = mongoose.model('buyer', buyerSchema, 'buyers');

// Password utilities

// Explicitly select pwhash for password checking
export async function checkBuyerPassword(buyerId, candidatePassword) {
    const buyer = await Buyer.findById(buyerId).select('+pwhash');
    if (!buyer?.pwhash) return false;
    return await bcrypt.compare(candidatePassword, buyer.pwhash);
}

export async function updateBuyerPassword(id, rawPassword) {
    const salt = await bcrypt.genSalt(10);
    const pwhash = await bcrypt.hash(rawPassword, salt);
    await Buyer.updateOne({ _id: id }, { pwhash });
    return findBuyerById(id);
}

// CRUD functions

export async function createBuyer(username, email, rawPassword) {
    let pwhash;
    if (rawPassword) {
        const salt = await bcrypt.genSalt(10);
        pwhash = await bcrypt.hash(rawPassword, salt);
    }

    const newBuyer = await Buyer.create({
        username, 
        email,
        pwhash
    });
    return newBuyer;
}

export async function findAllBuyers() {
    return await Buyer.find();  // pwhash is excluded by default
}

export async function findBuyerById(id) {
    return await Buyer.findById(id);  // pwhash is excluded by default
}

export async function findBuyerByUsername(username) {
    return await Buyer.findOne({ username });  // pwhash is excluded by default
}

export async function updateBuyer({ _id, username, email }) {
    await Buyer.updateOne({ _id }, { username, email });
    return findBuyerById(_id);
}

export async function addFavoriteListingForBuyer(buyer, listing) {
    buyer.favorites.push(listing)
    await buyer.save()
    return findBuyerById(buyer._id)
}

export async function getFavoriteListingsForBuyer(buyer) {
    const buyerWithFavorites = await Buyer.findById(buyer._id).populate('favorites')
    return buyerWithFavorites.favorites
}

export async function deleteBuyer(id) {
    return await Buyer.deleteOne({ _id: id });
}

export async function deleteAllBuyers() {
    return await Buyer.deleteMany();
}