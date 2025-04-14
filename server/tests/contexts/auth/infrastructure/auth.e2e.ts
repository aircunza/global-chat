import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import request from "supertest";

import { AppBackend } from "../../../../src/apps/app";
import { downSeedAuth, upSeedAuth } from "./auth.seed";

describe("Test fot /auth paths", function () {
  let application: AppBackend;
  let _response: request.Response;

  beforeAll(async function () {
    application = new AppBackend();
    await application.start();
    await downSeedAuth();
    await upSeedAuth();
  });

  describe("POST /login", function () {
    test("Should return status code 200", async function () {
      const inputData = {
        email: "admin@admin.com",
        password: "1234",
      };

      _response = await request(application.httpServer)
        .post("/login")
        .send(inputData);
      expect(_response.statusCode).toBe(200);
      expect(_response.body.session.accessToken).toBeTruthy();
      expect(_response.body.user.email).toEqual(inputData.email);
      expect(_response.body.user.password).toBeUndefined();
    });

    test("Should return status code 401", async function () {
      const wrongData = {
        email: "admin@admin.com",
        password: "12345", // wrong password
      };
      _response = await request(application.httpServer)
        .post("/login")
        .send(wrongData);
      expect(_response.statusCode).toBe(401);
    });

    test("Should return status code 404", async function () {
      const wrongData = {
        email: "admin@admin.comxxx", // wrong email
        password: "12345",
      };
      _response = await request(application.httpServer)
        .post("/login")
        .send(wrongData);
      expect(_response.statusCode).toBe(404);
    });
  });

  afterAll(async function () {
    await downSeedAuth();
    await application.stop();
  });
});
