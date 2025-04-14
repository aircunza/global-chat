Feature: Api status
    In order to know the server is up and running
    As a health check
    I want to check the api status

  Scenario: Check status
    Given I send a GET request to "/status-users"
    Then I should get a response 200
