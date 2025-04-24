import { User } from "../../../domain/entity/User";
import { IUserRepository } from "../../../domain/repository/IUserRepository.rp";
import { createPostgresqlClient } from "./PostgresqlConfig";

/**
 * PostgreSQL implementation of the IUserRepository interface.
 * Handles CRUD operations for User entities in a PostgreSQL database.
 */
export class PostgresqlRepository implements IUserRepository {
  /**
   * Fetches up to 10 users from the database.
   * @returns An array of User entities
   */
  public async findAll(): Promise<User[]> {
    const client = createPostgresqlClient();
    await client.connect();
    const res = await client.query("SELECT * FROM users LIMIT 10");

    if (res.rows.length > 0) {
      const users = res.rows.map(
        (user) =>
          new User({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
          })
      );
      await client.end();
      return users;
    }

    await client.end();
    return [];
  }

  /**
   * Finds a user by their email.
   * @param email - The email to search for
   * @returns A User entity or null if not found
   */
  public async findByEmail(email: string): Promise<User | null> {
    const client = createPostgresqlClient();
    await client.connect();
    try {
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (result.rows.length <= 0) return null;
      return result.rows[0];
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      await client.end();
    }
  }

  /**
   * Finds a user by their unique ID.
   * @param id - The user ID
   * @returns A User entity or null if not found
   */
  public async findById(id: string): Promise<User | null> {
    try {
      const client = createPostgresqlClient();
      await client.connect();
      const result = await client.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      if (result.rows.length <= 0) return null;
      return result.rows[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Persists a new user in the database.
   * @param user - The User entity to save
   * @returns The saved User entity with updated values from the database
   */
  public async save(user: User): Promise<User> {
    const client = createPostgresqlClient();
    await client.connect();
    const newUser = await client.query(
      "INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4) RETURNING *",
      [user.id, user.name, user.email, user.password]
    );
    client.end();
    return newUser.rows[0];
  }
}
