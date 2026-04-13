import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://adarsh_kanaujia_user:VGXSAoKJkNSC9qQQDlqibEyns6WCNtaF@dpg-d7e8obt8nd3s73bab3n0-a.oregon-postgres.render.com/adarsh_kanaujia",
  ssl: { rejectUnauthorized: false }
});

export default pool;
