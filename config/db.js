import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: ".env" }); //Variables de entorno

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connection = new Sequelize(
  process.env.BD_NAME,
  process.env.BD_USER || null,
  process.env.BD_PASSWORD || null,
  {
    dialect: process.env.BD_DIALECT || "sqlite",
    storage:
      process.env.BD_STORAGE || path.join(__dirname, "../", "CampuHomeManager.sqlite"),
    define: {
      underscored: true,
    },
    logging: false,
    pool: {
      max: parseInt(process.env.BD_POOL_MAX, 10) || 5,
      min: parseInt(process.env.BD_POOL_MIN, 10) || 0,
      acquire: parseInt(process.env.BD_POOL_ACQUIRE, 10) || 30000,
      idle: parseInt(process.env.BD_POOL_IDLE, 10) || 10000,
    },
  }
);

export default connection;
