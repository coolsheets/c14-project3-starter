import express from 'express';
import { checkBuyerPassword, findBuyerByUsername } from '../models/buyers.js';
import { optionalBuyerAuth, optionalSellerAuth } from './auth.js';

//
// thanks GPT:
// https://chatgpt.com/share/683e1844-9568-8013-92ad-7583dbd4e9ab
//

const router = express.Router();

router.post('/loginBuyer', async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const buyer = await findBuyerByUsername(username);
        const isValid = buyer && await checkBuyerPassword(buyer._id, password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // ✅ Auth success — you could return more here (token, buyer info, etc.)
        res.json(buyer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/me', optionalBuyerAuth, optionalSellerAuth, (req, res) => {
    res.send(req.buyer || req.seller || "null")
})

export default router;