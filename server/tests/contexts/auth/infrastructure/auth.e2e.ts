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

  describe("POST /sign-up", function () {
    test("Should return status code 400, bad request or incomplete information", async function () {
      const wrongData = {
        email: "admin@admin.com",
        password: "1234",
      };
      const result = await request(application.httpServer)
        .post("/sign-up")
        .send(wrongData);
      expect(result.statusCode).toBe(400);
    });

    test("Should return status code 409, User already exists", async function () {
      const wrongData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "admin",
        email: "admin@admin.com",
        password: "1234",
      };

      const result = await request(application.httpServer)
        .post("/sign-up")
        .send(wrongData);
      expect(result.statusCode).toBe(409);
    });
    test("Should return status code 201 and a User created", async function () {
      const inputData = {
        id: "550e8400-e29b-41d4-a716-446655440999",
        name: "admin8",
        email: "admin8@admin.com",
        password: "1234",
      };
      const result = await request(application.httpServer)
        .post("/sign-up")
        .send(inputData);
      expect(result.statusCode).toBe(201);

      expect(result.body).toEqual({
        id: "550e8400-e29b-41d4-a716-446655440999",
        name: "admin8",
        email: "admin8@admin.com",
      });
      expect(result.body.password).toBeUndefined();
    });
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
