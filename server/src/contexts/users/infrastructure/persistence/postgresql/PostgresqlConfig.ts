import { Client, Pool } from "pg";

import { configUsers } from "../../config";

export const poolPostgresql = new Pool({
  user: configUsers.get("postgresql.user"),
  password: configUsers.get("postgresql.password"),
  host: configUsers.get("postgresql.host"),
  port: configUsers.get("postgresql.port"),
  database: configUsers.get("postgresql.db"),
});

export const createPostgresqlClient = () => {
  return new Client({
    user: configUsers.get("postgresql.user"),
    password: configUsers.get("postgresql.password"),
    host: configUsers.get("postgresql.host"),
    port: configUsers.get("postgresql.port"),
    database: configUsers.get("postgresql.db"),
  });
};
