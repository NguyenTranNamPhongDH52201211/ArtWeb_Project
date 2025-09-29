export interface User{
    id_user:string;
    full_name:string;
    email:string;
    password_hash:string;
    phone?:string;
    roles?:'customer' | 'admin';
    created_at?:Date;
}