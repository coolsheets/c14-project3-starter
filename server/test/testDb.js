import dotenv from "dotenv";
dotenv.config({ path: "./test/.env" });

const dbUri = process.env.MONGO_URI

if (!(dbUri.includes('test') || dbUri.includes('Test'))) {
    throw new Error('Can only run tests against a "test" database '+ dbUri)
}

export * from '../models/db.js'

import { deleteAllBuyers } from '../models/buyers.js'
import { deleteAllListings } from '../models/listings.js'
import { deleteAllSellers } from '../models/sellers.js'

import { disconnectDb } from '../models/db.js'

export async function cleanoutDatabase() {
    await deleteAllListings()
    await deleteAllSellers()
    await deleteAllBuyers()
}

beforeEach(async () => {
    await cleanoutDatabase()
})

afterAll(async () => {
    await disconnectDb()
})