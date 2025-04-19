import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import request from "supertest";

import { AppBackend } from "../../../../src/apps/app";
import container from "../../../../src/apps/users/dependency-injection/index";
import { UserDTO } from "../../../../src/apps/users/dtos/UserDto";
import { FindAllUsers } from "../../../../src/contexts/users/application/useCases/FindAllUsers";
import { FindUserById } from "../../../../src/contexts/users/application/useCases/FindUserById";
import { downSeedUSer, upSeedUsers } from "./user.seed";

/**
 * Integration tests for `/users` routes.
 * This test suite verifies different user-related endpoints including:
 * - User creation
 * - User retrieval
 * - Token validation
 * - Profile access
 * - Health check
 */
describe("Test for /users paths", () => {
  let application: AppBackend;
  let _response: request.Response;
  let rawCookies = "";
  let accessTokenCookie = "";

  /**
   * Setup phase before running tests:
   * - Start backend app
   * - Seed the database
   * - Authenticate as admin to get a valid token
   */
  beforeAll(async () => {
    application = new AppBackend();
    await application.start();
    await downSeedUSer();
    await upSeedUsers();

    const inputData = {
      email: "admin@admin.com",
      password: "1234",
    };

    const loginResponse = await request(application.httpServer)
      .post("/login")
      .send(inputData);

    rawCookies = loginResponse.headers["set-cookie"];

    // Extract access token from cookies
    if (Array.isArray(rawCookies)) {
      accessTokenCookie = rawCookies.find((cookie: string) =>
        cookie.startsWith("accessToken=")
      );
    } else if (typeof rawCookies === "string") {
      if (rawCookies.startsWith("accessToken=")) {
        accessTokenCookie = rawCookies;
      }
    }
  });

  /**
   * Test suite for POST /users
   */
  describe("POST /users", () => {
    test("Should return 498 when the access token is corrupted or invalid", async function () {
      const invalidTokenCookie =
        "accessToken=INVALID.TOKEN.VALUE; Path=/; HttpOnly; SameSite=Strict";

      const newUser = {
        id: "550e8400-e29b-41d4-a716-446655440033",
        name: "John Doe",
        email: "invalid@example.com",
        password: "1234",
      };

      const response = await request(application.httpServer)
        .post("/users")
        .set("Cookie", invalidTokenCookie)
        .send(newUser);

      expect(response.statusCode).toBe(498); // or 401 depending on your error handling
    });

    test("Should return a User created", async function () {
      const newUser = {
        id: "550e8400-e29b-41d4-a716-446655440033",
        name: "John Doe",
        email: "Tt8hI@example.com",
        password: "1234",
      };

      _response = await request(application.httpServer)
        .post("/users")
        .send(newUser)
        .set("Cookie", accessTokenCookie);

      expect(_response.statusCode).toEqual(201);
      expect(_response.body.id).toEqual("550e8400-e29b-41d4-a716-446655440033");
    });
  });

  /**
   * Health check endpoint
   */
  describe("GET Health check /status-users", () => {
    test("Should return 200", async () => {
      _response = await request(application.httpServer).get("/status-users");
      expect(_response).toBeTruthy();
    });
  });

  /**
   * Tests for fetching a single user by ID
   */
  describe("GETS /users/{id}", () => {
    test("Should return a User", async function () {
      const dbService = container.get<FindUserById>(
        "Contexts.users.application.useCases.FindUserById"
      );

      const result = await dbService.run(
        "550e8400-e29b-41d4-a716-446655440000"
      );
      const user = result ? UserDTO.fromEntity(result) : null;
      const idSearched = "550e8400-e29b-41d4-a716-446655440000";

      _response = await request(application.httpServer)
        .get(`/users/${idSearched}`)
        .set("Cookie", accessTokenCookie);

      expect(user?.id).toEqual(_response.body.id);
    });

    test("Should return Not Found 404 status code", async function () {
      const idSearched = "550e8400-e29b-41d4-a716-446655440099";

      _response = await request(application.httpServer)
        .get(`/users/${idSearched}`)
        .set("Cookie", accessTokenCookie);

      expect(_response.statusCode).toEqual(404);
      expect(_response.body).toEqual(null);
    });
  });

  /**
   * Tests for retrieving all users
   */
  describe("GET /users", function () {
    test("Should return users", async function () {
      const useCase = container.get<FindAllUsers>(
        "Contexts.users.application.useCases.FindAllUsers"
      );
      const result = await useCase.run();
      const users = result.map((user) => UserDTO.fromEntity(user));

      _response = await request(application.httpServer)
        .get("/users")
        .set("Cookie", accessTokenCookie);

      expect(_response.statusCode).toEqual(200);
      expect(_response.body.length).toEqual(users.length);
      expect(_response.body[0].id).toBeTruthy();
      expect(_response.body[0]).toEqual(users[0]);
    });

    test("Return status code 498 because invalid token", async function () {
      const invalidTokenCookie =
        "accessToken=INVALID.TOKEN.VALUE; Path=/; HttpOnly; SameSite=Strict";

      const profileResponse = await request(application.httpServer)
        .get("/users")
        .set("Cookie", invalidTokenCookie);

      expect(profileResponse.statusCode).toBe(498);
    });
  });

  /**
   * Tests for the authenticated user's profile endpoint
   */
  describe("GET /profile", function () {
    test("Return status code 200", async function () {
      const inputData = {
        email: "admin@admin.com",
        password: "1234",
      };

      const loginResponse = await request(application.httpServer)
        .post("/login")
        .send(inputData);

      const token = loginResponse.body.session.accessToken;

      const profileResponse = await request(application.httpServer)
        .get("/profile")
        .set("Cookie", accessTokenCookie);

      expect(profileResponse.statusCode).toBe(200);
    });

    test("Return status code 498 because invalid token", async function () {
      const invalidTokenCookie =
        "accessToken=INVALID.TOKEN.VALUE; Path=/; HttpOnly; SameSite=Strict";

      const profileResponse = await request(application.httpServer)
        .get("/profile")
        .set("Cookie", invalidTokenCookie);

      expect(profileResponse.statusCode).toBe(498);
    });
  });

  /**
   * Cleanup phase after running tests:
   * - Clear database seed
   * - Stop the application
   */
  afterAll(async () => {
    await downSeedUSer();
    await application.stop();
    rawCookies = "";
    accessTokenCookie = "";
  });
});
