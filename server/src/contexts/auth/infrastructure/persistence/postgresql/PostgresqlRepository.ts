import { User } from "../../../domain/entity/User";
import { IAuthRepository } from "../../../domain/repository/IAuthRepository.rp";
import { createPostgresqlClient } from "./PostgresqlConfig";

/**
 * PostgreSQL implementation of the IAuthRepository interface.
 * Handles operations related to user authentication data.
 */
export class PostgresqlRepository implements IAuthRepository {
  /**
   * Finds a user by their email address.
   *
   * @param email - The email of the user to find.
   * @returns The user if found, otherwise null.
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
      // Ensure the client connection is closed regardless of success or error
      await client.end();
    }
  }

  /**
   * Finds a user by their unique ID.
   *
   * @param id - The ID of the user to find.
   * @returns The user if found, otherwise null.
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
      console.error(e);
      return null;
    }
  }

  /**
   * Saves a new user into the database.
   *
   * @param user - The user entity to be saved.
   * @returns The saved user entity returned from the database.
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
