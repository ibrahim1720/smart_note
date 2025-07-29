import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Mongodb connected');
})
.catch(()=>{
    console.log('Failed to connect to Mongodb');
});

export default connectDB;



