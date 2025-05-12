import { createBuyer } from "../models/buyers.js";
import { disconnectDb } from "../models/db.js";

// [ 'node', 'createBuyer.js', 'tonye', 'tony_e@inceptionu.com' ]

if (process.argv < 4) {
    console.log("Usage: node createBuyer <username> <email>")
    process.exit(1)
}
const username = process.argv[2]
const email = process.argv[3]

await createBuyer(username, email)
console.log(`Buyer ${username} created with email ${email}`)

await disconnectDb()