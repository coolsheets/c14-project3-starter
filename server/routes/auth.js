import { findBuyerByUsername, checkPassword } from '../models/buyers.js';

//
// Authoured with GPT:
// https://chatgpt.com/share/6830bb7c-03f8-8013-9eb5-1aacba9d9e9b
//

export async function basicAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).set('WWW-Authenticate', 'Basic').send('Authorization required');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (!username || !password) {
        return res.status(401).send('Invalid authorization format');
    }

    try {
        const buyer = await findBuyerByUsername(username);
        const isValid = buyer && await checkPassword(buyer._id, password);

        if (!isValid) {
            return res.status(401).send('Invalid username or password');
        }

        // Attach authenticated buyer to request
        req.buyer = buyer;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
}