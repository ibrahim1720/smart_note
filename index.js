import express, { json } from 'express';
import connectDB from './config/mongodb.js';
import authRouter from "./routes/authRouter.js";
import notesRouter from "./routes/notesRouter.js";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import userRouter from "./routes/userRouter.js";
import {globalResponse} from "./middleware/errorhandlerMiddleware.js";


const port = 3000;

await connectDB;

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    }
});
app.use(helmet());
app.use(limiter);

app.use(json());

app.use('/api', authRouter);
app.use('/api', notesRouter);
app.use('/api', userRouter);


app.use((req, res) => {
    res.status(404).json({ message: 'This router is not exist' });

});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(globalResponse);