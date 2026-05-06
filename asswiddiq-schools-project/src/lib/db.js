// lib/db.js
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "192.168.1.107",
  database: "asswiddiq_schools",
  password: "123",
  port: 5432,
});

export default pool;