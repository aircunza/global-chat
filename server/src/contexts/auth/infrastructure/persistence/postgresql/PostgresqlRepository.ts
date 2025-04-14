import { User } from "../../../domain/entity/User";
import { IAuthRepository } from "../../../domain/repository/IAuthRepository.rp";
import { createPostgresqlClient } from "./PostgresqlConfig";

export class PostgresqlRepository implements IAuthRepository {
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
}
