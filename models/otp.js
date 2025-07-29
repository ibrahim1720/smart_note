import mongoose, { Schema } from 'mongoose';

const otpSchema = new Schema({
    otp: { type: String, required: true},
    createdAt: { type: Date, default: Date.now, expires: '5m' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true}
    }
);

export const Otp = mongoose.model('Otp', otpSchema);