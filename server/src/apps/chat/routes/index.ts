import { Router } from "express";
import fs from "fs";

export const registerRoutes = (router: Router) => {
  const routes = fs.readdirSync(__dirname);
  routes.forEach((file) => {
    if (file !== "index.ts") {
      const { register } = require(`${__dirname}/${file}`);
      register(router);
    }
  });
};
