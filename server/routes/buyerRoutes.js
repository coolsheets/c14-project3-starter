import { Router } from "express";
import { createBuyer, deleteBuyer, findAllBuyers, findBuyerById, updateBuyer } from "../models/buyers.js";
import { basicAuth } from "./auth.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const allBuyers = await findAllBuyers()
        res.send(allBuyers)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post('/', async (req, res) => {
    const { username, email, password} = req.body
    if (!username || !email || !password) {
        res.status(400).send("username and email and password required")
    }

    try {
        const newBuyer = await createBuyer(username, email, password)
        res.send(newBuyer)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.get('/:buyerId', async function (req, res) {
    const { buyerId } = req.params

    try {
        const buyer = await findBuyerById(buyerId)
        res.send(buyer)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.put('/:buyerId', async function (req, res) {
    const { username, email } = req.body
    if (!username || !email) {
        res.status(400).send("username and email required")
    }
    const { buyerId } = req.params

    try {
        const buyer = await updateBuyer({
            _id: buyerId,
            email,
            username
        } )
        res.send(buyer)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

})

router.delete('/:buyerId', async function(req, res) {
    const { buyerId } = req.params

    try {
        const result = await deleteBuyer(buyerId)
        res.send(result)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

})

export default router