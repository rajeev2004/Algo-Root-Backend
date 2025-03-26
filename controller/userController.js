import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import db from "../config/db.js";
export async function login(req,res){
    const key=process.env.SECRET_KEY;
    const {email,pass}=req.body;
    try{
        if(!email || !pass){
            throw new Error('Credentials Not provided');
        }
        const user=await db.query('select * from users where email=$1',[email]);
        if(user.rows.length===0){
            throw new Error('No user Found with this email');
        }
        const savedPass=user.rows[0].password;
        const isPasswordCorrect=await bcrypt.compare(pass,savedPass);
        if(!isPasswordCorrect){
            throw new Error('Incorrect Password');
        }
        const token=jwt.sign({id:user.rows[0].id},key,{expiresIn:'12h'});
        return res.status(200).json({token,message:'login successful'});
    }catch(err){
        return res.status(500).json({error:err.message});
    }
}
export async function register(req,res){
    const {email,pass}=req.body;
    const key=process.env.SECRET_KEY;
    try{
        if(!email || !pass){
            throw new Error('Provide all the credentials');
        }
        const userExist=await db.query('select * from users where email=$1',[email]);
        if(userExist.rows.length>0){
            throw new Error('User Already exist with this email');
        }
        const hashedPass=await bcrypt.hash(pass,10);
        const userRegister=await db.query('insert into users(email,password) values($1,$2) RETURNING *',[email,hashedPass]);
        if(userRegister.rows.length===0){
            throw new Error('please Try again');
        }
        const token=jwt.sign({id:userRegister.rows[0].id},key,{expiresIn:'12h'});
        return res.status(200).json({message:'user registered',token});
    }catch(err){
        return res.status(500).json({error:err.message});
    }
}
export async function sendMessage(req,res){
    const {id}=req.user;
    try{
        const detail=await db.query('select * from users where id=$1',[id]);
        return res.status(200).json({message:'User verified',detail:detail.rows[0]});
    }catch(err){
        return res.status(500).json({error:err.message});
    }
}
export async function deleteAccount(req,res){
    const {id}=req.user;
    try{
        const deletedAccount=await db.query('delete from users where id=$1 RETURNING *',[id]);
        if(deletedAccount.rows.length>0){
            return res.status(200).json({message:'account deleted'});
        }else{
            throw new Error('Cannot delete the account! please try again')
        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }
}