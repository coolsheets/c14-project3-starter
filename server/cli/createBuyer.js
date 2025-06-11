import { createBuyer } from "../models/buyers.js";
import { disconnectDb } from "../models/db.js";

// [ 'node', 'createBuyer.js', 'tonye', 'tony_e@inceptionu.com' ]

if (process.argv < 5) {
    console.log("Usage: node createBuyer <username> <email> <password>")
    process.exit(1)
}
const username = process.argv[2]
const email = process.argv[3]
const password = process.argv[4]

await createBuyer(username, email, password)
console.log(`Buyer ${username} created with email ${email}`)

await disconnectDb()