import { createSeller, createSellerAndLogin, doGet, doPost, doPut, shutdownServer, startServer } from "./testServer.js"

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

    it('should find a listing by id', async () =>{
        // setup

        const seller = await createSellerAndLogin()
        // use data layer to create a listing for this seller
        const newListing = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item of Great Importance',
            description: 'That is right, this item of Great Importance should be purchased immediately!'
        })

        // execute
        const foundListing = await doGet(`${baseUrl}/api/listings/${newListing._id}`)

        // verify
        expect(foundListing.title).toEqual(newListing.title)
        expect(foundListing.description).toEqual(newListing.description)
        expect(foundListing.seller).toEqual(seller._id.toString())  
    })

    it.only('should find listings that are "mine" for a logged in seller', async () => {
        // setup (same as above)
        const seller = await createSellerAndLogin()
        
        const newListing = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item of Great Importance',
            description: 'That is right, this item of Great Importance should be purchased immediately!'
        })

        // execute /api/listings/mine
        const myListings = await doGet(`${baseUrl}/api/listings/mine`)

        // verify list
        const found = myListings.find(l => l._id === newListing._id)
        expect(found).toBeDefined()
        expect(found.title).toEqual(newListing.title)
        expect(found.seller).toEqual(seller._id.toString())        
    })

    it.skip('should not find listings that are not "mine" for a logged in seller', async () => {
        // setup 
        const seller1 = await createSellerAndLogin()
        
        const newListing1 = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item 1',
            description: 'The first item'
        }) 
        
        const newListing2 = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item 2',
            description: 'The second item'
        }) 
        
        const newListing3 = await doPost(`${baseUrl}/api/listings`, {
            title: 'Item 3',
            description: 'The third item'
        }) 
        // use data layer to manually create another seller
        const seller2 = await createSeller('otherSeller', 's2@gmail.com', 'password123')

        // use data layer to create a few listings for them

        // execute /api/listings/mine

        // verify listings only include the ones created for 'logged in' seller
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