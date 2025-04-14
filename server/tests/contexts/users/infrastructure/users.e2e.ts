import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import request from "supertest";

import { AppBackend } from "../../../../src/apps/app";
import container from "../../../../src/apps/users/dependency-injection/index";
import { UserDTO } from "../../../../src/apps/users/dtos/UserDto";
import { FindAllUsers } from "../../../../src/contexts/users/application/useCases/FindAllUsers";
import { FindUserById } from "../../../../src/contexts/users/application/useCases/FindUserById";
import { downSeedUSer, upSeedUsers } from "./user.seed";

describe("Test for /users paths", () => {
  let application: AppBackend;
  //let _request: request.Test;
  let _response: request.Response;
  let _accessToken = "";

  beforeAll(async () => {
    application = new AppBackend();
    await application.start();
    await downSeedUSer();
    await upSeedUsers();
    // login:
    const inputData = {
      email: "admin@admin.com",
      password: "1234",
    };
    const loginResponse = await request(application.httpServer)
      .post("/login")
      .send(inputData);
    _accessToken = loginResponse.body.session.accessToken;
  });

  describe("POST /users", () => {
    test("Should return Bad Request 400 status code. It should be a valid UUID", async function () {
      const newUser = {
        id: "550e8400-e29b-41d4-a716-446655440033-xxx",
        name: "John Doe",
        email: "Tt8hI@example.com",
        password: "1234",
      };
      _response = await request(application.httpServer)
        .post("/users")
        .send(newUser);
      expect(_response?.statusCode).toEqual(400);
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
        .send(newUser);
      expect(_response?.statusCode).toEqual(201);
      expect(_response?.body?.id).toEqual(
        "550e8400-e29b-41d4-a716-446655440033"
      );
    });
  });

  describe("GET Health check /status-users", () => {
    test("Should return 200", async () => {
      _response = await request(application.httpServer).get("/status-users");
      expect(_response).toBeTruthy();
    });
  });

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
        .set({
          authorization: `Bearer ${_accessToken}`,
        });
      expect(user?.id).toEqual(_response.body.id);
    });

    test("Should return Not Found 400 status code", async function () {
      const idSearched = "550e8400-e29b-41d4-a716-446655440099";
      _response = await request(application.httpServer)
        .get(`/users/${idSearched}`)
        .set({
          authorization: `Bearer ${_accessToken}`,
        });
      expect(_response.statusCode).toEqual(404);
      expect(_response.body).toEqual(null);
    });
  });

  describe("GET /users", function () {
    test("GET /users", async function () {
      const useCase = container.get<FindAllUsers>(
        "Contexts.users.application.useCases.FindAllUsers"
      );
      const result = await useCase.run();
      const users = result.map((user) => UserDTO.fromEntity(user));
      _response = await request(application.httpServer)
        .get("/users")
        .set({
          authorization: `Bearer ${_accessToken}`,
        });
      expect(_response.statusCode).toEqual(200);
      expect(_response.body.length).toEqual(users.length);
      expect(_response.body[0].id).toBeTruthy();
      expect(_response.body[0]).toEqual(users[0]);
    });
    test("Return status code 498 because invalid token", async function () {
      //invalid token
      const token =
        "xxxeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImlhdCI6MTc0NDM5OTcwMiwiZXhwIjoxNzQ0NDI4NTAyfQ.SF7jrHNF-e_AsWrz0S4CmBe50jG4Mx6Vyq0Xs6EPGnU";
      // GET /profile
      const profileResponse = await request(application.httpServer)
        .get("/users")
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(profileResponse.statusCode).toBe(498);
    });
  });

  describe("GET /profile", function () {
    test("Return status code 200", async function () {
      // login:
      const inputData = {
        email: "admin@admin.com",
        password: "1234",
      };
      const loginResponse = await request(application.httpServer)
        .post("/login")
        .send(inputData);
      const token = loginResponse.body.session.accessToken;
      // GET /profile:
      const profileResponse = await request(application.httpServer)
        .get("/profile")
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(profileResponse.statusCode).toBe(200);
    });
    test("Return status code 498 because invalid token", async function () {
      //invalid token
      const token =
        "xxxeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImlhdCI6MTc0NDM5OTcwMiwiZXhwIjoxNzQ0NDI4NTAyfQ.SF7jrHNF-e_AsWrz0S4CmBe50jG4Mx6Vyq0Xs6EPGnU";
      // GET /profile
      const profileResponse = await request(application.httpServer)
        .get("/profile")
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(profileResponse.statusCode).toBe(498);
    });
  });

  afterAll(async () => {
    await downSeedUSer();
    await application.stop();
    _accessToken = "";
  });
});
