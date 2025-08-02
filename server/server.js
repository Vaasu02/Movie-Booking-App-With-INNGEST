import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkMiddleware, clerkClient } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoute.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebhook } from './controllers/stripeWebhooks.js';

// Make clerkClient globally available for debugging
global.clerkClient = clerkClient;

const app = express();
const port=3000;

await connectDB();

app.use('/api/stripe',express.raw({type:'application/json'}),stripeWebhook);


app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())



app.get('/',(req,res)=>{
    res.send('server started brooo!');
})
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show',showRouter);
app.use('/api/booking',bookingRouter);
app.use('/api/admin',adminRouter);
app.use('/api/user',userRouter);

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})