/**
 * Domain entity representing a User.
 * Encapsulates user-related data such as ID, name, email, and password.
 */
export class User {
  id: string; // Unique identifier for the user
  name: string; // Full name of the user
  email: string; // Email address of the user
  password: string; // Hashed password of the user

  /**
   * Creates a new User instance.
   *
   * @param id - The unique ID of the user
   * @param name - The name of the user
   * @param email - The email address of the user
   * @param password - The hashed password of the user
   */
  constructor({
    id,
    name,
    email,
    password,
  }: {
    id: string;
    name: string;
    email: string;
    password: string;
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
