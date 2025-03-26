import express from "express";
const router=express.Router();
import authenticateToken from "../middleware/Authenticate.js";
import { deleteAccount, login,register,sendMessage } from "../controller/userController.js";
router.post('/login',login);
router.post('/register',register);
router.get('/checkAuthentication',authenticateToken,sendMessage);
router.delete('/delete',authenticateToken,deleteAccount);
export default router;