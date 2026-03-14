
import * from "dotenv";

dotenv.config();

const config = {
  development: {
    client: "mysql2",
    connection: {
      host,
      port(process.env.DB_PORT || '3306', 10),
      user,
      password,
      database,
      ssl
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    }
  },

  production: {
    client: "mysql2",
    connection: {
      host,
      port(process.env.DB_PORT || '3306', 10),
      user,
      password,
      database,
      ssl
    },
    pool: {
      min,
      max
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    }
  }

};

export default config;
