import dotenv from "dotenv";

type EnvType = "dev" | "test" | "prod";

const nodeEnv = (process.env.NODE_ENV as EnvType) || "dev";

const envFileMap: Record<EnvType, string> = {
  dev: ".env.dev",
  test: ".env.test",
  prod: ".env",
};

dotenv.config({ path: envFileMap[nodeEnv] });

const urlClients = Object.keys(process.env)
  .filter((key) => key.startsWith("URL_CLIENT") && process.env[key])
  .sort()
  .map((key) => process.env[key] as string);

export const configApps = {
  port: process.env.PORT_API || "3000",
  jwtSecret: process.env.JWT_SECRET || "secret",
  urlClients,
};
