import bcrypt from 'bcryptjs';
import { connectDb } from "./db.js";

const mongoose = await connectDb();

// Schema
const sellerSchema = new mongoose.Schema({
  username: String,
  email: String,
  pwhash: {
    type: String,
    required: false,
    select: false // Hide pwhash from queries by default
  }
});

// Model
const Seller = mongoose.model('seller', sellerSchema, 'sellers');

// Password utilities

export async function checkSellerPassword(sellerId, candidatePassword) {
  const seller = await Seller.findById(sellerId).select('+pwhash');
  if (!seller?.pwhash) return false;
  return await bcrypt.compare(candidatePassword, seller.pwhash);
}

export async function updateSellerPassword(id, rawPassword) {
  const salt = await bcrypt.genSalt(10);
  const pwhash = await bcrypt.hash(rawPassword, salt);
  await Seller.updateOne({ _id: id }, { pwhash });
  return findSellerById(id);
}

// CRUD functions

export async function createSeller(username, email, rawPassword) {
  let pwhash;
  if (rawPassword) {
    const salt = await bcrypt.genSalt(10);
    pwhash = await bcrypt.hash(rawPassword, salt);
  }

  const newSeller = await Seller.create({
    username,
    email,
    pwhash
  });
  return newSeller;
}

export async function findAllSellers() {
  return await Seller.find(); // pwhash excluded by default
}

export async function findSellerById(id) {
  return await Seller.findById(id); // pwhash excluded by default
}

export async function findSellerByUsername(username) {
  return await Seller.findOne({ username }); // pwhash excluded by default
}

export async function updateSeller({ _id, username, email }) {
  await Seller.updateOne({ _id }, { username, email });
  return findSellerById(_id);
}

export async function deleteSeller(id) {
  return await Seller.deleteOne({ _id: id });
}

export async function deleteAllSellers() {
  return await Seller.deleteMany();
}
