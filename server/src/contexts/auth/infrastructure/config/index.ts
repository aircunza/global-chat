import convict from "convict";
import dotenv from "dotenv";

const pathFile = `.env.${process.env.NODE_ENV || "dev"}`;
dotenv.config({ path: pathFile });

const configAuth = convict({
  port: {
    doc: "El puerto de la API",
    format: "port",
    default: 3000,
    env: "PORT_API",
  },
  postgresql: {
    db: {
      doc: "Name of database PostgreSQL",
      format: String,
      default: "pg",
      env: "PG_DB",
    },
    user: {
      doc: "Name of user database PostgreSQL",
      format: String,
      default: "user",
      env: "PG_USER",
    },
    password: {
      doc: "Password of user database PostgreSQL",
      format: String,
      default: "password",
      env: "PG_PASSWORD",
    },
    port: {
      doc: "Port of database PostgreSQL",
      format: Number,
      default: 5432,
      env: "PG_PORT",
    },
    host: {
      doc: "Host of database PostgreSQL",
      format: String,
      default: "localhost",
      env: "PG_HOST",
    },
  },
});

configAuth.validate({ allowed: "strict" });

export { configAuth };
