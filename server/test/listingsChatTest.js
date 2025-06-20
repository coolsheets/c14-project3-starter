import { createBuyer } from "../models/buyers"
import { addBuyerMessageToChat, addSellerMessageToChat, createListing, findAllChatsForBuyer, findAllChatsForListing, findAllListings, findListingsBySeller, findNewChatsForBuyer, findNewChatsForSeller, findOrCreateChatForListing } from "../models/listings"
import { createSeller } from "../models/sellers"


export async function createBuyerSellerAndListing() {
    const buyer = await createBuyer('buyer','buyer@buyer.com', 'password123')
    const seller = await createSeller('seller', 'seller@seller.com', 'password123')
    const listing = await createListing('Test Listing', 'This is a test listing', seller._id)
    return { buyer, seller, listing }
}

describe('listing data layer', () => {

    it('should list an empty database', async () => {
        // setup

        // execute
        const listings = await findAllListings()

        //verify
        expect(listings.length).toEqual(0)
    })

    it('should create a listing for a seller', async () => {
        // setup
        const seller = await createSeller('seller', 'seller@seller.com', 'password123')

        // execute
        await createListing('Test Listing', 'This is a test listing', seller._id)

        // verify
        const actualListings = await findAllListings()
        expect(actualListings.length).toEqual(1)
        const actualListing = actualListings[0]
        expect(actualListing.title).toEqual('Test Listing')
        expect(actualListing.description).toEqual('This is a test listing')
    })

    it('should find listings for a seller', async () => {
        // setup
        const seller = await createSeller('seller', 'seller@seller.com', 'password123')
        await createListing('Test Listing', 'This is a test listing', seller._id)

        // execute
        const actualListings = await findListingsBySeller(seller)

        // verify
        expect(actualListings.length).toEqual(1)
        const actualListing = actualListings[0]
        expect(actualListing.title).toEqual('Test Listing')
        expect(actualListing.description).toEqual('This is a test listing')
    })

    it('should allow a buyer to create a new chat', async () => {
        // setup
        const { buyer, listing } = await createBuyerSellerAndListing()

        // execute
        const listingChat = await findOrCreateChatForListing(listing, buyer)

        // verify
        expect(listingChat).toBeDefined()
        expect(listingChat.listing.toString()).toEqual(listing._id.toString())
        expect(listingChat.buyer.toString()).toEqual(buyer._id.toString())
    })

    it('should reuse an existing chat on the same listing', async () => {
        // setup
        const { buyer, listing } = await createBuyerSellerAndListing()
        const ogListingChat = await findOrCreateChatForListing(listing, buyer)

        // execute
        const listingChat = await findOrCreateChatForListing(listing, buyer)

        // verify
        expect(listingChat).toBeDefined()
        expect(listingChat._id.toString()).toEqual(ogListingChat._id.toString())
    })

    it('should allow the buyer to find all their chats', async () => {
        // setup
        const { buyer, listing } = await createBuyerSellerAndListing()
        const listingChat = await findOrCreateChatForListing(listing, buyer)

        // execute
        const chats = await findAllChatsForBuyer(buyer)
        
        // verify
        expect(chats.length).toEqual(1)
        const actualChat = chats[0]
        expect(actualChat._id.toString()).toEqual(listingChat._id.toString())
    })

    it('should allow a seller to find all chats on a listing', async () => {
        // setup
        const { buyer, seller, listing } = await createBuyerSellerAndListing()
        const listingChat = await findOrCreateChatForListing(listing, buyer)

        // execute
        const chats = await findAllChatsForListing(listing)

        // verify
        expect(chats.length).toEqual(1)
        const actualChat = chats[0]
        expect(actualChat._id.toString()).toEqual(listingChat._id.toString())
        expect(actualChat.listing.toString()).toEqual(listing._id.toString())
        expect(actualChat.buyer.toString()).toEqual(buyer._id.toString())
    })

    it('should add buyer messages to a chat', async () => {
        // setup
        const { buyer, listing } = await createBuyerSellerAndListing()
        const listingChat = await findOrCreateChatForListing(listing, buyer)

        // execute
        await addBuyerMessageToChat(listingChat, 'Hello Seller!')

        // verify
        const chats = await findAllChatsForBuyer(buyer)
        expect(chats.length).toEqual(1)
        const actualChat = chats[0]
        expect(actualChat.listing.toString()).toEqual(listing._id.toString())
        expect(actualChat.buyer.toString()).toEqual(buyer._id.toString())
        expect(actualChat.messages.length).toEqual(1)
        expect(actualChat.messages[0].content).toEqual('Hello Seller!')
        expect(actualChat.messages[0].side).toEqual('buyer')
    })

    it('should add seller messages to a chat', async () => {
        // setup
        const { buyer, seller, listing } = await createBuyerSellerAndListing()
        const listingChat = await findOrCreateChatForListing(listing, buyer)
        await addBuyerMessageToChat(listingChat, 'Hello Seller!')

        // execute
        await addSellerMessageToChat(listingChat, 'Hello Buyer!')

        // verify
        const chats = await findAllChatsForBuyer(buyer)
        expect(chats.length).toEqual(1)
        const actualChat = chats[0]
        expect(actualChat.listing.toString()).toEqual(listing._id.toString())
        expect(actualChat.buyer.toString()).toEqual(buyer._id.toString())
        expect(actualChat.messages.length).toEqual(2)
        expect(actualChat.messages[0].content).toEqual('Hello Seller!')
        expect(actualChat.messages[0].side).toEqual('buyer')
        expect(actualChat.messages[1].content).toEqual('Hello Buyer!')
        expect(actualChat.messages[1].side).toEqual('seller')
    })


    it.skip('should let a seller find chats with new messages in them', async () => {
        // setup
        const { buyer, seller, listing } = await createBuyerSellerAndListing()
        const listingChat = await findOrCreateChatForListing(listing, buyer)
        await addBuyerMessageToChat(listingChat, 'Hello Seller!')

        // execute
        const chats = await findNewChatsForSeller(seller)

        // verify
        expect(chats.length).toEqual(1)
        const actualChat = chats[0]
        expect(actualChat.listing.toString()).toEqual(listing._id.toString())
        expect(actualChat.buyer.toString()).toEqual(buyer._id.toString())
        expect(actualChat.messages.length).toEqual(1)
        expect(actualChat.messages[0].content).toEqual('Hello Seller!')
    })

    it.skip('new messages from a seller should "clear" new chats so they do not show up again as new', async () => {
        // setup
        const { buyer, seller, listing } = await createBuyerSellerAndListing()
        const listingChat = await findOrCreateChatForListing(listing, buyer)
        await addBuyerMessageToChat(listingChat, buyer, 'Hello Seller!')
        const ogNewChats = await findNewChatsForSeller(seller)
        expect(ogNewChats.length).toEqual(1)

        // execute
        await addSellerMessageToChat(listingChat, seller, 'Hello Buyer!')

        // verify
        const newChats = await findNewChatsForSeller(seller)
        expect(newChats.length).toEqual(0)
    })

    it.skip('should let a buyer find chats with new messages in them', async () => {
        // setup
        const { buyer, seller, listing } = await createBuyerSellerAndListing()
        const listingChat = await findOrCreateChatForListing(listing, buyer)
        await addBuyerMessageToChat(listingChat, buyer, 'Hello Seller!')
        await addSellerMessageToChat(listingChat, seller, 'Hello Buyer!')

        // execute
        const newChats = await findNewChatsForBuyer(seller)

        // verify
        expect(newChats.length).toEqual(1)
        const actualChat = newChats[0]
        expect(actualChat.listing.toString()).toEqual(listing._id.toString())
        expect(actualChat.buyer.toString()).toEqual(buyer._id.toString())
        expect(actualChat.messages.length).toEqual(2)
        expect(actualChat.messages[0].content).toEqual('Hello Seller!')
        expect(actualChat.messages[1].content).toEqual('Hello Buyer!')
    })

})