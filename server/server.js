import express from 'express';

import authRoutes from './routes/authRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import listingRoutes from './routes/listingRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/listings', listingRoutes);

const server = app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})