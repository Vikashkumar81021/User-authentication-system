import express  from "express";
import cookieParser from "cookie-parser";
const app=express();
app.use(express.json({limit:"5kb"}))
app.use(cookieParser())


//routes
import userRoute from "./routes/user.route.js"


//route declaration
app.use('/api/v1/users',userRoute)
export {app}