import { Client, Pool } from "pg";

import { configAuth } from "../../config";

export const poolPostgresql = new Pool({
  user: configAuth.get("postgresql.user"),
  password: configAuth.get("postgresql.password"),
  host: configAuth.get("postgresql.host"),
  port: configAuth.get("postgresql.port"),
  database: configAuth.get("postgresql.db"),
});

export const createPostgresqlClient = () => {
  return new Client({
    user: configAuth.get("postgresql.user"),
    password: configAuth.get("postgresql.password"),
    host: configAuth.get("postgresql.host"),
    port: configAuth.get("postgresql.port"),
    database: configAuth.get("postgresql.db"),
  });
};
