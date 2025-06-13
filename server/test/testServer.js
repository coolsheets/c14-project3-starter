import './testDb.js'

import express from 'express'
import { configure } from '../app'

import { createBuyer } from '../models/buyers.js'
import { createSeller } from '../models/sellers.js'

let runningServers = {}
let credential  // from the currently running test

export async function startServer() {
    const app = express()
    configure(app)

    return await new Promise((resolve, reject) => {
        let server = app.listen(() => {
            const baseUrl = 'http://localhost:' + server.address().port
            runningServers[baseUrl] = server
            resolve(baseUrl)
        })
    })
}

export async function shutdownServer(baseUrl) {
    if (!runningServers[baseUrl]) return Promise.resolve()
    return new Promise((resolve, reject) => {
        runningServers[baseUrl].close((err) => {
            delete runningServers[baseUrl]
            if (err) {
                reject() 
            }
            else {
                resolve()
            }
        })
    })
}

export function createCredentialHeaders(username, password) {
    return {
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    }
}

export async function setCredentials(email, password) {
    credential = 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64')
}

export async function createBuyerAndLogin(username = "Buyer McBuyer", email = "someEmail@email.com", password = "somePassword", displayName="Some Display Name") {
    const buyer = await createBuyer(username, email, password)
    setCredentials(username, password)
    return buyer
}

export async function createSellerAndLogin(username="Seller McSeller", email = "someEmail@email.com", password = "somePassword", displayName="Some Display Name") {
    const seller = await createSeller( username, email, password )
    setCredentials(username, password)
    return seller
}

export async function logout() {
    credential = undefined
}

export async function doGet(url) {
    const headers = getCredentialHeaders()

    const response = await fetch(url, { headers })
    if (!response.ok) {
        throw new Error('Request to ' + url + ' failed with status: ' + response.status)
    }
    return await response.json()
}

export async function doPost(url, body) {
    const headers = getCredentialHeaders()
    headers['Content-Type'] = 'application/json'

    const response = await fetch(url, {
        method: 'post',
        headers,
        body: JSON.stringify(body)
    })
    expect(response.status).toEqual(200) // HTTP request failed!
    return await response.json()
}

export async function doPut(url, body) {
    const headers = getCredentialHeaders()
    headers['Content-Type'] = 'application/json'

    const response = await fetch(url, {
        method: 'put',
        headers,
        body: JSON.stringify(body)
    })
    expect(response.status).toEqual(200) // HTTP request failed!
    return await response.json()
}

export async function doDelete(url) {
    const headers = getCredentialHeaders()

    const response = await fetch(url, { 
        method: 'delete',
        headers 
    })
    if (!response.ok) {
        throw new Error('Request to DELETE ' + url + ' failed with status: ' + response.status)
    }
    return await response.json()
}

export function getCredentialHeaders(headers = {}) {
    if (credential) headers['Authorization']=credential
    return headers
}


afterAll(async () => {
    const baseUrls = Object.keys(runningServers)
    await Promise.allSettled(baseUrls.map(shutdownServer))
})