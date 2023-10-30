import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'; // Import dotenv like this

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Your database name
  process.env.DB_USER,     // Your database username
  process.env.DB_PASSWORD, // Your database password
  {
    dialect: 'mysql',      // Replace with your database type (e.g., 'mysql', 'postgres', 'sqlite', 'mssql', etc.)
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
  }
);

export default sequelize;
