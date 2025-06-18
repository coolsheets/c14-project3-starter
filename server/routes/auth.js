import { findBuyerByUsername, checkBuyerPassword } from '../models/buyers.js';
import { findSellerByUsername, checkSellerPassword } from '../models/sellers.js';

//
// thanks GPT:
// https://chatgpt.com/share/683e1844-9568-8013-92ad-7583dbd4e9ab
//

export async function buyerAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).send('Authorization required');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (!username || !password) {
        return res.status(401).send('Invalid authorization format');
    }

    try {
        const buyer = await findBuyerByUsername(username);
        const isValid = buyer && await checkBuyerPassword(buyer._id, password);

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

export async function optionalBuyerAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        // No credentials — proceed without authentication
        return next();
    }

    try {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        if (!username || !password) {
            return next(); // malformed, but we won't reject
        }

        const buyer = await findBuyerByUsername(username);
        const isValid = buyer && await checkBuyerPassword(buyer._id, password);

        if (isValid) {
            req.buyer = buyer; // attach to request
        }

        // Proceed regardless of auth success
        return next();
    } catch (err) {
        console.error('Optional auth error:', err);
        return next(); // fail silently
    }
}

export async function sellerAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).send('Authorization required');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (!username || !password) {
        return res.status(401).send('Invalid authorization format');
    }

    try {
        const seller = await findSellerByUsername(username);
        const isValid = seller && await checkSellerPassword(seller._id, password);

        if (!isValid) {
            return res.status(401).send('Invalid username or password');
        }

        // Attach authenticated buyer to request
        req.seller = seller;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
}

export async function optionalSellerAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        // No credentials — proceed without authentication
        return next();
    }

    try {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        if (!username || !password) {
            return next(); // malformed, but we won't reject
        }

        const seller = await findSellerByUsername(username);
        const isValid = seller && await checkSellerPassword(seller._id, password);

        if (isValid) {
            req.seller = seller; // attach to request
        }

        // Proceed regardless of auth success
        return next();
    } catch (err) {
        console.error('Optional auth error:', err);
        return next(); // fail silently
    }
}