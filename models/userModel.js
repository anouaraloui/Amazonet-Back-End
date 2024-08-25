import mongoose from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true
        },
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    password: { 
        type: String, 
        required: true
    },
    resetToken: { 
        type: String
    },
    role: {
      type: String,
      enum: ["Admin", "Customer", "Deliveryman"],
      required: true
    }
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

export default User;