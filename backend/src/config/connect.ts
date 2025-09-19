import mysql, {Pool} from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

 const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT) ,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
    waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Kết nối MySQL thành công!");
    conn.release();
  } catch (err: any) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
  }
})();

export default pool;