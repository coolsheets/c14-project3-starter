import { createBuyerAndLogin, createSellerAndLogin, doGet, doPost, doPut, getCredentialHeaders, shutdownServer, startServer } from "./testServer.js"

// sample controller layer tests... 
// virtually all interactions are through GET and POST 

describe('/api/listings', () => {

    let baseUrl
    beforeEach(async () => {
        baseUrl = await startServer()
    })

    afterEach(async () => {
        await shutdownServer(baseUrl)
    })

    it('should list an empty database', async () => {
        //setup

        //execute
        const listings = await doGet(`${baseUrl}/api/listings`)

        // verify
        expect(listings.length).toEqual(0)
    })

    it('should add a listing for the logged in seller', async () => {
        //setup
        const seller = await createSellerAndLogin()

        //execute
        const newListing = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item of Great Importance',
            description: 'That is right, this item of Great Importance should be purchased immediately!'
        })

        // verify
        const listings = await doGet(`${baseUrl}/api/listings`)
        expect(listings.length).toEqual(1)
        const listing = listings[0]
        expect(listing.title).toEqual(newListing.title)
        expect(listing.description).toEqual(newListing.description)
        expect(listing.seller).toEqual(seller._id.toString())
    })

    it('should find a listing by id', async () => {
        //setup
        const seller = await createSellerAndLogin()
        const newListing = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item of Great Importance',
            description: 'That is right, this item of Great Importance should be purchased immediately!'
        })

        // execute
        const listing = await doGet(`${baseUrl}/api/listings/${newListing._id}`)

        // verify
        expect(listing.title).toEqual(newListing.title)
        expect(listing.description).toEqual(newListing.description)
        expect(listing.seller).toEqual(seller._id.toString())    
    })

    it('should find listings that are "mine" for a logged in seller', async () => {
        //setup
        const seller = await createSellerAndLogin()
        const newListing = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item of Great Importance',
            description: 'That is right, this item of Great Importance should be purchased immediately!'
        })

        // execute
        const listings = await doGet(`${baseUrl}/api/listings/mine`)

        // verify
        expect(listings.length).toEqual(1)
        const listing = listings[0]
        expect(listing.title).toEqual(newListing.title)
        expect(listing.description).toEqual(newListing.description)
        expect(listing.seller).toEqual(seller._id.toString())    
    })

    it('should not find listings that are not "mine" for a logged in seller', async () => {
        //setup
        const preExistingSeller = await createSellerAndLogin('other seller')
        await doPost(`${baseUrl}/api/listings`, {
            title: 'Item #1 Belonging to other Seller',
            description: 'Buy me now!'
        })
        await doPost(`${baseUrl}/api/listings`, {
            title: 'Item #2 Belonging to other Seller',
            description: 'Buy me now!'
        })
        const loggedInSeller = await createSellerAndLogin('logged in seller')
        const item3 = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item #1 Belonging to other Seller',
            description: 'Buy me now!'
        })

        // execute
        const listings = await doGet(`${baseUrl}/api/listings/mine`)

        // verify
        expect(listings.length).toEqual(1)
        const listing = listings[0]
        expect(listing.title).toEqual(item3.title)
        expect(listing.description).toEqual(item3.description)
        expect(listing.seller).toEqual(loggedInSeller._id.toString())    
    })

    it('should allow updating a listing when logged in the seller', async () => {
        //setup
        const seller = await createSellerAndLogin()
        const newListing = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item of Great Importance',
            description: 'That is right, this item of Great Importance should be purchased immediately!'
        })
        const updatedTitle = 'Item of Massive Importance'
        const updatedDescription = 'Yes, get it now!'

        // execute
        const updatedListing = await doPut(`${baseUrl}/api/listings/${newListing._id}`, {
            title: updatedTitle,
            description: updatedDescription
        })

        // verify
        expect(updatedListing.title).toEqual(updatedTitle)
        expect(updatedListing.description).toEqual(updatedDescription)
        const listing = await doGet(`${baseUrl}/api/listings/${newListing._id}`)
        expect(listing.title).toEqual(updatedTitle)
        expect(listing.description).toEqual(updatedDescription)
    })


    it('should not allow creation of a listing when logged in as a buyer', async () => {
        //setup
        const buyer = await createBuyerAndLogin()

        // execute
        const response = await fetch(`${baseUrl}/api/listings`, {
            method: 'post',
            headers: getCredentialHeaders({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                title: 'some title',
                description: 'some description'
            })
        })

        // verify
        expect(response.status).toEqual(401)
    })

    it('should not allow updating a listing when logged as a seller who does not own the listing', async () => {
        //setup
        const otherSeller = await createSellerAndLogin('someOtherSeller')
        const listingBelongingToSomeoneElse = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item of Great Importance',
            description: 'That is right, this item of Great Importance should be purchased immediately!'
        })
        const loggedInSeller = await createSellerAndLogin('loggedIn')

        // execute
        const response = await fetch(`${baseUrl}/api/listings/${listingBelongingToSomeoneElse._id}`, {
            method: 'put',
            headers: getCredentialHeaders({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                title: 'some title',
                description: 'some description'
            })
        })

        // verify
        expect(response.status).toEqual(403)
    })


})