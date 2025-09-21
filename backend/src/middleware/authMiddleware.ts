import  {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request{
    userId?:string;
    userEmail?:string;
    userRoles?:string;
}

export const authenticateToken =(req:AuthRequest, res:Response, next: NextFunction)=>
{
    try{
        const authHeader =req.headers['authorization'];
        const token =authHeader && authHeader.split(' ')[1];
        
        if(!token){
            return  res.status(401).json({
                success:false,
                message:'Token khong duoc cung cap'
            });
        }

    }catch(error){
        
    }
}