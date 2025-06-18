import { Router } from "express";
import {
    createSeller,
    deleteSeller,
    findAllSellers,
    findSellerById,
    updateSeller
} from "../models/sellers.js";
import { sellerAuth } from "./auth.js";

const router = Router();

// GET /api/sellers
router.get("/", async (req, res) => {
    try {
        const allSellers = await findAllSellers();
        res.send(allSellers);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// POST /api/sellers
router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send("username, email, and password required");
    }

    try {
        const newSeller = await createSeller(username, email, password);
        res.send(newSeller);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// GET /api/sellers/:sellerId
router.get("/:sellerId", async (req, res) => {
    const { sellerId } = req.params;
    try {
        const seller = await findSellerById(sellerId);
        res.send(seller);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// PUT /api/sellers/:sellerId
router.put("/:sellerId", sellerAuth, async (req, res) => {
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).send("username and email required");
    }

    const { sellerId } = req.params;
    if (req.seller._id.toString() !== sellerId) {
        return res.status(403).send("You can only update your own seller profile");
    }

    try {
        const updated = await updateSeller({ _id: sellerId, username, email });
        res.send(updated);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// DELETE /api/sellers/:sellerId
router.delete("/:sellerId", async (req, res) => {
    const { sellerId } = req.params;
    try {
        const result = await deleteSeller(sellerId);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

export default router