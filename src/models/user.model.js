import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema=new mongoose.Schema(
    {
   userName:{
    type:String,
    required: [true,"userName is required"],
    unique:true,
    lowercase:true,
    trim:true
   },
   email:{
    type:String,
    required: [true,"Email is required"],
    unique:true,
    lowercase:true,
    trim:true
   },
   password: {
    type: String,
    required: [true,"Password is required"],
    minlength: 6
},
phone:{
    type:Number,
    required: [true,"PhoneNumber is required"]
},
age:{
 type:Number,
 required: [true,"Age is required"]
},
refreshToken:{
    type:String,
}
},
{timestamps:true}
)

//hash password
userSchema.pre("save",async function(next){
if(!this.isModified("password")) return next();
this.password=await bcrypt.hash(this.password,10);
next();
})

//compare Password
userSchema.methods.isPasswordCorrect=async function(password){
  return  await bcrypt.compare(password,this.password)
}

//generate Access token
userSchema.methods.generateAccessToken=async function(){
 return  jwt.sign(
    {
    _id:this._id
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
)
}

//generate Refresh token
userSchema.methods.generateRefreshToken=async function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)