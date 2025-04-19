import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import request from "supertest";

import { AppBackend } from "../../../../src/apps/app";
import { downSeedAuth, upSeedAuth } from "./auth.seed";

/**
 * Integration tests for `/auth` endpoints.
 * Covers:
 * - User sign-up (POST /sign-up)
 * - User login (POST /login)
 */
describe("Test for /auth paths", function () {
  let application: AppBackend;
  let _response: request.Response;

  /**
   * Setup: start the application and seed the auth database
   */
  beforeAll(async function () {
    application = new AppBackend();
    await application.start();
    await downSeedAuth();
    await upSeedAuth();
  });

  /**
   * Tests for user registration via POST /sign-up
   */
  describe("POST /sign-up", function () {
    test("Should return status code 400 for bad request or incomplete data", async function () {
      const wrongData = {
        email: "admin@admin.com",
        password: "1234", // missing 'name' and 'id'
      };

      const result = await request(application.httpServer)
        .post("/sign-up")
        .send(wrongData);

      expect(result.statusCode).toBe(400);
    });

    test("Should return status code 409 if user already exists", async function () {
      const existingUser = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "admin",
        email: "admin@admin.com",
        password: "1234",
      };

      const result = await request(application.httpServer)
        .post("/sign-up")
        .send(existingUser);

      expect(result.statusCode).toBe(409);
    });

    test("Should return status code 201 and create a user", async function () {
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

      // Ensure password is not leaked in response
      expect(result.body.password).toBeUndefined();
    });
  });

  /**
   * Tests for user login via POST /login
   */
  describe("POST /login", function () {
    test("Should return 200 and a valid session on successful login", async function () {
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

      // Password must not be returned
      expect(_response.body.user.password).toBeUndefined();
    });

    test("Should return 401 when password is incorrect", async function () {
      const wrongData = {
        email: "admin@admin.com",
        password: "12345", // incorrect password
      };

      _response = await request(application.httpServer)
        .post("/login")
        .send(wrongData);

      expect(_response.statusCode).toBe(401);
    });

    test("Should return 404 when user is not found", async function () {
      const wrongData = {
        email: "admin@admin.comxxx", // incorrect email
        password: "12345",
      };

      _response = await request(application.httpServer)
        .post("/login")
        .send(wrongData);

      expect(_response.statusCode).toBe(404);
    });
  });

  /**
   * Cleanup: reset DB and stop the app
   */
  afterAll(async function () {
    await downSeedAuth();
    await application.stop();
  });
});
