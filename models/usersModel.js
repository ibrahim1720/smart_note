import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    email:{type:String , required:true , unique:true},
    password:{type:String , required:true, minlength: 6},
    profilePics: { type: String, default: null },
},{
    timestamps: true
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
export const User = mongoose.model('User', userSchema);
