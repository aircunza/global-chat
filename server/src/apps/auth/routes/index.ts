import { Router } from "express";
import fs from "fs";

export function registerRoutes(router: Router) {
  const fileNames = fs.readdirSync(__dirname);
  fileNames.forEach(function (file: string) {
    if (file !== "index.ts") {
      const route = require(`${__dirname}/${file}`);
      route.register(router);
    }
  });
}
