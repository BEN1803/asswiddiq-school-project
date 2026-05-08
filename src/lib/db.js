// lib/db.js
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "192.168.1.100",
  database: "postgres",
  password: "emma",
  port: 5432,
});

export default pool;