import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "porfolio-db.cw2dxrj7cvep.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "71781037Ss",
  database: "porfolio"
});

export default db;