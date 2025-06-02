import express from 'express';
import { checkPassword, findBuyerByUsername } from '../models/buyers.js';
import { basicAuth, optionalBasicAuth } from './auth.js';

//
// Authoured with GPT:
// https://chatgpt.com/share/6830bb7c-03f8-8013-9eb5-1aacba9d9e9b
//

const router = express.Router();

router.post('/login', async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const buyer = await findBuyerByUsername(username);
        const isValid = buyer && await checkPassword(buyer._id, password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // ✅ Auth success — you could return more here (token, buyer info, etc.)
        res.json({ message: 'Login successful', buyer: { id: buyer._id, username: buyer.username, email: buyer.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/me', optionalBasicAuth, (req, res) => {
    res.send(req.buyer || "null")
})

export default router;