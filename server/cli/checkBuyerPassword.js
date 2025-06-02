import { checkBuyerPassword, findBuyerByUsername, } from "../models/buyers.js";
import { disconnectDb } from "../models/db.js";

if (process.argv < 4) {
    console.log("Usage: node createBuyer <username> <password>")
    process.exit(1)
}
const username = process.argv[2]
const password = process.argv[3]

const buyer = await findBuyerByUsername(username)
if (!buyer) {
    console.log("User not found:", username)
    process.exit()
}
const result = await checkBuyerPassword(buyer._id, password)

console.log("Password:", (result) ? "OK" : "NOPE!")
await disconnectDb()