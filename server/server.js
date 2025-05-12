import express from 'express';
import buyerRoutes from './routes/buyerRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/buyers', buyerRoutes);

const server = app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})