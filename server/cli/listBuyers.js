import { findAllBuyers } from "../models/buyers.js";
import { disconnectDb } from "../models/db.js";

const buyers = await findAllBuyers()
buyers.forEach(buyer => {
    console.log(buyer)
})

await disconnectDb()