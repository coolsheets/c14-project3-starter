import { createSeller, findSellerById } from "../models/sellers.js"
import { createSellerAndLogin, doGet, doPost, doPut, getCredentialHeaders, setCredentials, shutdownServer, startServer } from "./testServer.js"

// sample layer-crossing tests
// testing the controller is using the data layer properly

describe('/api/sellers', () => {

    let baseUrl
    beforeEach(async () => {
        baseUrl = await startServer()
    })

    afterEach(async () => {
        await shutdownServer(baseUrl)
    })

    it('should signup a seller', async () => {
        //setup

        //execute
        const apiResult = await doPost(`${baseUrl}/api/sellers`, {
            username: 'Mr. McSeller',
            email: "seller@selleverything.com",
            password: "SuperSecretPassword"
        })

        //verify - first the result of the POST
        expect(apiResult.username).toEqual('Mr. McSeller')
        expect(apiResult.email).toEqual('seller@selleverything.com')
        //and now check the data layer too
        const seller = await findSellerById(apiResult._id)
        expect(seller.username).toEqual('Mr. McSeller')
        expect(seller.email).toEqual('seller@selleverything.com')
    })

    it('should successfully authenticate a seller', async () => {
        //setup (use the data layer)
        const seller = await createSeller('tonysellz', 'tony@seller.com', '123456')

        //execute
        const apiResult = await doPost(`${baseUrl}/api/auth/loginSeller`, {
            username: 'tonysellz',
            password: '123456'
        })

        //verify - first the result of the POST
        expect(apiResult.username).toEqual(seller.username)
        expect(apiResult.email).toEqual(seller.email)
    })

    it('should unsuccessfully authenticate a seller with a bad password', async () => {
        //setup (use the data layer)
        await createSeller('tonysellz', 'tony@seller.com', '123456')

        //execute
        const response = await fetch(`${baseUrl}/api/auth/loginSeller`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'tonysellz',
                password: '654321'
            })            
        })

        // verify login attempt is rejected
        expect(response.ok).toEqual(false)
        expect(response.status).toEqual(401)
    })

    it('should retrieve a seller by id', async () => {
        //setup (use the data layer)
        const seller = await createSeller('tonysellz', 'tony@seller.com', '123456')

        //execute
        const apiResult = await doGet(`${baseUrl}/api/sellers/${seller._id}`)

        //verify - first the result of the POST
        expect(apiResult.username).toEqual(seller.username)
        expect(apiResult.email).toEqual(seller.email)
    })

    it('should update a seller', async () => {
        const seller = await createSeller('tonysellz', 'tony@seller.com', '123456')
        setCredentials(seller.username, '123456')
        const updatedUsername = 'tonysellzmore'
        const updatedEmail = 'updatedEmail@seller.com'
        
        //execute
        const apiResult = await doPut(`${baseUrl}/api/sellers/${seller._id}`, {
            username: updatedUsername,
            email: updatedEmail
        })

        //verify - first the result of the POST
        expect(apiResult.username).toEqual(updatedUsername)
        expect(apiResult.email).toEqual(updatedEmail)
        //verify - data layer
        const updatedSeller = await findSellerById(seller._id)
        expect(updatedSeller.username).toEqual(updatedUsername)
        expect(updatedSeller.email).toEqual(updatedEmail)
    })

    it('should only update a seller if you are logged in as that seller', async () => {
        //setup 
        const originalSeller = await createSeller('tonyseller', 'tony@seller.com', 'SuperSecret')
        const someOtherSeller = await createSellerAndLogin()

        //execute (use doPut with new data to /api/sellers/:id)
        const response = await fetch(`${baseUrl}/api/sellers/${originalSeller._id}`, {
            method: 'put',
            headers: getCredentialHeaders({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                username: 'tonysellz',
                email: 'someotheremail@email.com'
            })            
        })

        //verify
        expect(response.ok).toEqual(false)
        expect(response.status).toEqual(403)
    })

})