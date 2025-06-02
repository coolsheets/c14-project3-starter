import { findBuyerByUsername, updateBuyerPassword, } from "../models/buyers.js";
import { disconnectDb } from "../models/db.js";

if (process.argv < 4) {
    console.log("Usage: node updatePassword <username> <password>")
    process.exit(1)
}
const username = process.argv[2]
const password = process.argv[3]

const buyer = await findBuyerByUsername(username)
if (!buyer) {
    console.log("User not found:", username)
    process.exit()
}
await updateBuyerPassword(buyer._id, password)

await disconnectDb()