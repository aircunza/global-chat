import dotenv from "dotenv";

type EnvType = "dev" | "test" | "prod";

const nodeEnv = (process.env.NODE_ENV as EnvType) || "dev";

const envFileMap: Record<EnvType, string> = {
  dev: ".env.dev",
  test: ".env.test",
  prod: ".env",
};

dotenv.config({ path: envFileMap[nodeEnv] });

export const configApps = {
  port: process.env.PORT_API || "3000",
  jwtSecret: process.env.JWT_SECRET || "secret",
  urlClient1: process.env.URL_CLIENT1 || "http://localhost",
  urlClient2: process.env.URL_CLIENT2 || "http://localhost",
};
