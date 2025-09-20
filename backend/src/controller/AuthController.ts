import  { Request, Response } from 'express';
import bcrpyt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/UserRepositories';
import { User } from 'modules/user';
import connection from '../config/connect';

export class AuthController {

    private userRepo: any;

    constructor() {
        // Tạo instance của userRepository với connection
        const { userRepository: UserRepo } = require('../repositories/UserRepositories');
        this.userRepo = new UserRepo(connection);
    }

    //Dang ky user moi
    async register(req:Request, res:Response){
        try{

            const {full_name,email,phone,password} = req.body;

            if(!full_name || !email || !phone || !password){
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"});
        }

    //kiem tra email da ton tai chua
    const existUser = await  this.userRepo.findByEmail(email);
    if(existUser){
        return res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }
    //Ma hoa password
    const hashedPassword = await bcrpyt.hash(password, 10);
    //tao user moi
    
    const newUser:Omit<User,"id_user"|"created_at">={
        full_name,
        email,
        password_hash:hashedPassword,
        phone:phone ||null,
        roles:"customer"
    };

    const creatNewUser= await this.userRepo.createUser(newUser,"id_user","created_at");
    // Tao token
 

    const token = jwt.sign(
        {
            userId:creatNewUser.id_user,
            email:creatNewUser.email,
            roles:creatNewUser.roles
        },
        process.env.JWT_SECRET || 'your-secret-key',
        {expiresIn:'24h'}
    );
    const {password_hash,...userData}=creatNewUser;
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:{
            ...userData,
            token
        }
    });
      
        }catch(error){
            console.error("Error in register:", error);
            res.status(500).json({
                success:false,
                message:"Internal server error"
            });
        }
   }

   async login(req:Request, res:Response){
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            });
        }
        const user= await this.userRepo.findByEmail(email);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"
            });
        }
        const isPasswordValid= await bcrpyt.compare(password,user.password_hash);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"
            });
        }
        const token= jwt.sign(
            {
                userId:user.id_user,
                email:user.email,
                roles:user.roles
            },
            process.env.JWT_SECRET || 'your-secret-key',
            {expiresIn:'24h'}
        );

        const {password_hash,...userResponse}=user;
        res.status(200).json({
            success:true,
            message:"Login successful", 
            user:{
                user:userResponse,
                token
            }
        });
    }catch(error){
        console.error("Error in login:", error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
 }

}