Feature: Create a new user
  In order to have user in the platform
  As a user with admin permissions
  I want to create a new user

  Scenario: A valid non existing user
    Given I send a PUT request to "/create-user/ef8ac118-8d7f-49cc-abec-78e0d05af80a" with body:
      """
      {
        "name": "userName",
        "email": "email@email.com",
        "password":"userPassword"
      }
      """
    Then the response status code should be 201
    And the response should be empty
