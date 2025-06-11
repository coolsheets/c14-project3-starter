import express from 'express';
import { configure } from './app.js';

const app = express();
const PORT = process.env.PORT || 3000;

configure(app)

const server = app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})