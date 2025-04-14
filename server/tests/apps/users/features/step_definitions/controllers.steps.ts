import assert from "assert";
import { AfterAll, BeforeAll, Given, Then } from "cucumber";
import request from "supertest";

import { AppBackend } from "../../../../../src/apps/app";

let application: AppBackend;
let _request: request.Test;
let _response: request.Response;

//----- Health point ------

Given("I send a GET request to {string}", (route: string) => {
  _request = request(application.httpServer).get(route);
});

Then("I should get a response {int}", async (status: number) => {
  _response = await _request.expect(status);
});

//----- create-user ------

Given(
  "I send a PUT request to {string} with body:",
  (route: string, body: string) => {
    _request = request(application.httpServer)
      .put(route)
      .send(JSON.parse(body) as object);
  }
);
Then("the response status code should be {int}", async (status: number) => {
  _response = await _request.expect(status);
});

Then("the response should be empty", () => {
  assert.deepStrictEqual(_response.body, {});
});

// ----- start app ------

BeforeAll(async () => {
  application = new AppBackend();
  await application.start();
});

AfterAll(async () => {
  await application.stop();
});
