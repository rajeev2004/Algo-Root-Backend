import express from "express";
import route from './routes/route.js';
import cors from "cors";
import dotenv from "dotenv";
const app=express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use(route);
const PORT=5000 || process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`)
})
