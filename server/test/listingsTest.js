import { createSellerAndLogin, doGet, doPost, shutdownServer, startServer } from "./testServer.js"

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

    it.skip('should find a listing by id', () => {
        // setup

        // execute

        // verify
    })

    it.skip('should find listings that are "mine" for a logged in seller', async () => {
        // setup (same as above)

        // execute /api/listings/mine

        // verify list
    })

    it.skip('should not find listings that are not "mine" for a logged in seller', async () => {
        // setup 
        // create and login as seller (as above)
        // use data layer to create some listings for this seller
        // use data layer to manually create another seller 
        // use data layer to create a few listings for them

        // execute /api/listings/mine

        // verify listings only include the ones created for 'logged in' seller
    })

    it.skip('should allow updating a listing when logged in the seller', () => {
        // setup

        // execute

        // verify
    })


    it.skip('should not allow creation of a listing when logged in as a buyer', () => {
        // setup (login as buyer using fixture)

        // execute (POST /api/listings)

        // verify (request failz with 401)

    })

    it.skip('should not allow updating a listing when logged as a seller who does not own the listing', () => {
        // setup

        // execute

        // verify
    })


})