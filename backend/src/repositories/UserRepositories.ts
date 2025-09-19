import connection from "../config/connect";
import { Connection, ResultSetHeader} from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import {User} from "../modules/user"

export class userRepository{
    private db:Connection;

    constructor(db:Connection){
        this.db=db;
    }

    async findAll():Promise<User[]>{
        const [rows]= await this.db.query("SELECT * FROM Users");
        return rows as User[];
    }

    async findByID(id:string):Promise<User|null>{
        const [rows]= await this.db.query("SELECT * FROM Users where id_user= ?",[id]);
        const user=rows as User[];
        return user.length>0? user[0]:null;
    }

    async findByEmail(email:string):Promise<User|null>{
        const [rows]= await this.db.query("SELECT * FROM Users where email= ?",[email]);
        const user=rows as User[];
        return user.length >0 ? user[0]:null;
    }

    async createUser (user:Omit<User,"id_user"|"created_at">):Promise<User>{
        const id=uuidv4();
        const createdAt=new Date();

        await this.db.query("INSERT INTO Users (id_user, full_name, email, password_hash, phone, roles, created_at) VALUES (?,?,?,?,?,?,?)",
            [
                id,
                user.full_name,
                user.email,
                user.password_hash,
                user.phone,
                user.roles,
                createdAt
            ]
        );
        return {...user,id_user:id,created_at:createdAt};
    }

    async update(id:string, data:Partial<User>):Promise<User | null>{
        await this.db.query("UPDATE Users set ? where id_user= ? ",[data,id]);
        const [rows]=await this.db.query("SELECT *FROM Users where id_user=?  ",[id]);
        const user=(rows as User[])[0];

        return user || null;
    }

    async  delete(id:string):Promise<boolean>{
        const[result]=await this.db.query<ResultSetHeader>(
            "DELETE FROM Users where id_user= ?",[id]
        )
        return result.affectedRows>0;
    }
}

