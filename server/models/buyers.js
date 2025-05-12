import { connectDb } from "./db.js";

const mongoose = await connectDb();

// Schema 
const buyerSchema = new mongoose.Schema({
    username: String,
    email: String,
})

// Models
const Buyer = mongoose.model('buyer', buyerSchema, 'buyers')

// Functions to expose to the outside world!
export async function createBuyer(username, email) {
    const newBuyer = await Buyer.create({
        username, 
        email
    })    
    return newBuyer
}

export async function findAllBuyers() {
    const buyers = await Buyer.find()
    return buyers
}

export async function findBuyerById(id) {
    const buyer = await Buyer.findById(id)
    return buyer
}

export async function updateBuyer({ _id, username, email }) {
    await Buyer.updateOne({ _id }, { username, email })
    return findBuyerById(_id)
}

export async function deleteBuyer(id) {
    return await Buyer.deleteOne({ _id: id})
}

export async function deleteAllBuyers() {
    return await Buyer.deleteMany()
}
